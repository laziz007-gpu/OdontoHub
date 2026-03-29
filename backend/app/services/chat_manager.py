import asyncio
from typing import Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # One active socket per authenticated user.
        self.active_connections: Dict[int, WebSocket] = {}
        self.connection_loops: Dict[int, asyncio.AbstractEventLoop] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.connection_loops[user_id] = asyncio.get_running_loop()

    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)
        self.connection_loops.pop(user_id, None)

    async def send_personal_message(self, message: dict, user_id: int):
        websocket = self.active_connections.get(user_id)
        if websocket:
            try:
                await websocket.send_json(message)
            except Exception:
                # Socket may be stale; drop it to avoid repeated failures.
                self.disconnect(user_id)
                return False
            return True
        return False

    def send_personal_message_sync(self, message: dict, user_id: int) -> bool:
        websocket = self.active_connections.get(user_id)
        loop = self.connection_loops.get(user_id)
        if not websocket or not loop:
            return False
        try:
            future = asyncio.run_coroutine_threadsafe(websocket.send_json(message), loop)
            future.result(timeout=2)
            return True
        except Exception:
            self.disconnect(user_id)
            return False

    def is_online(self, user_id: int) -> bool:
        return user_id in self.active_connections

manager = ConnectionManager()
