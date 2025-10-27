import React from 'react';

const Toolbar = ({ brushSize, setBrushSize, color, setColor }) => {
    return (
        <div className="toolbar">
            <label>
                Brush Size:
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(e.target.value)}
                />
            </label>
            <label>
                Color:
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
            </label>
        </div>
    );
};

export default Toolbar;