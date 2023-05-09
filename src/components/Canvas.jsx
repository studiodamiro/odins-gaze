import React, { useEffect } from 'react';
import Tooltip from './Tooltip';
import Cursor from './Cursor';
import Object from './Object';
import ObjectImage from './ObjectImage';
import { pickRandomNumbers } from './helper/CommonFunctions';
import { useCursorPosition, useCursorPositionUpdate } from './hooks/CursorPositionContext';
import { useCursorFollowUpdate } from './hooks/CursorFollowContext';
import { usePickedObjects, usePickedObjectsUpdate } from './hooks/PickedObjectsContext';

// Image should be strictly 1512 x 982 pixels
import image from '../assets/sample_img.webp';
// Object Data from the Image
import { sceneGarage } from '../data/SceneGarage';

function Canvas() {
    const cursor = useCursorPosition().percent;
    const cursorUpdate = useCursorPositionUpdate();
    const cursorFollowUpdate = useCursorFollowUpdate();

    const objects = usePickedObjects();
    const setObjects = usePickedObjectsUpdate();

    const handleClick = () => {
        cursorUpdate({ x: window.clientX, y: window.clientY });
        cursorFollowUpdate(true);
    };

    const checkClickWithinBounds = (objectBound, cursorPos) => {
        const { xStart, xStop, yStart, yStop } = objectBound;
        const { x, y } = cursorPos;
        if (x >= xStart && x <= xStop && y >= yStart && y <= yStop) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        const randomNumbers = pickRandomNumbers(3, sceneGarage.length);
        const filteredObjects = sceneGarage.filter((object) => {
            return randomNumbers.includes(object.id);
        });
        const mapObjects = filteredObjects.map((object, index) => ({
            id: index,
            name: object.name,
            shown: false,
            bounds: {
                xStart: object.x,
                yStart: object.y,
                xStop: object.x + object.width,
                yStop: object.y + object.height,
            },
        }));
        console.log(mapObjects);
        setObjects.setLost(mapObjects);
    }, []);

    useEffect(() => {
        const clickedObject = objects.lost.find((object) =>
            checkClickWithinBounds(object.bounds, cursor)
        );
        if (clickedObject) {
            setObjects.setClick(clickedObject.id);
        } else {
            setObjects.setClick(null);
        }
    }, [cursor, objects, setObjects]);

    return (
        <main>
            <Cursor />
            <Tooltip />
            <div className="game-image" onClick={handleClick}>
                <div className="markers">
                    {objects.found.map((object) => (
                        <Object key={object.id} object={object} show={object.shown} />
                    ))}
                </div>
                <ObjectImage img={image} blur={0} />
            </div>
        </main>
    );
}

export default Canvas;
