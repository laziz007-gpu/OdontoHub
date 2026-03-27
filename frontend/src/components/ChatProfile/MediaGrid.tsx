const MediaGrid = () => {
    return (
        <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square bg-[#D9D9D9] rounded-2xl overflow-hidden hover:opacity-90 cursor-pointer transition-opacity" />
            ))}
        </div>
    );
};

export default MediaGrid;
