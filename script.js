document.addEventListener('DOMContentLoaded', () => {
    const joystickKnob = document.getElementById('joystick-knob');
    const joystickContainer = document.getElementById('joystick-container');
    const waistSlider = document.getElementById('waist-slider');
    const headHorizontal = document.getElementById('head-horizontal-slider');
    const headVertical = document.getElementById('head-vertical-slider');
    const joyStickRadius = 75;
    let isDragging = false;

    joystickKnob.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    function startDrag(event) {
        isDragging = true;
        drag(event);
    }

    function drag(event) {
        if (isDragging) {
            const containerRect = joystickContainer.getBoundingClientRect();
            const knobRect = joystickKnob.getBoundingClientRect();
            let x = event.clientX - containerRect.left - containerRect.width / 2;
            let y = event.clientY - containerRect.top - containerRect.height / 2;
            const distanceFromCenter = Math.sqrt(x * x + y * y);

            if (distanceFromCenter <= joyStickRadius) {
                joystickKnob.style.transform = `translate(${x}px, ${y}px)`;
            } else {
                const scaleFactor = joyStickRadius / distanceFromCenter;
                x *= scaleFactor;
                y *= scaleFactor;
                joystickKnob.style.transform = `translate(${x}px, ${y}px)`;
            }
            const normX = x / joyStickRadius;
            const normY = y / joyStickRadius;
            sendJoystickData(normX, normY);
        }
    }

    function endDrag(event) {
        isDragging = false;
        joystickKnob.style.transform = 'translate(0, 0)';
        sendJoystickData(0, 0);
    }

    function sendJoystickData(joystickX, joystickY) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/control', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`joystickX=${joystickX}&joystickY=${joystickY}&waistPosition=${waistSlider.value}&headHorizontal=${headHorizontal.value}&headVertical=${headVertical.value}`);
    }
});
