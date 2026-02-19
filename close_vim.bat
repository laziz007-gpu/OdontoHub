@echo off
taskkill /F /IM vim.exe 2>nul
taskkill /F /IM nvim.exe 2>nul
taskkill /F /IM vi.exe 2>nul
taskkill /F /IM gvim.exe 2>nul
echo Vim processes killed
timeout /t 2 /nobreak >nul
git merge --abort
echo Merge aborted
git status
