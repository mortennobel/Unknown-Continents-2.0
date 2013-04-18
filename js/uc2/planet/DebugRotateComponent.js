define(["kick"],
    function (kick) {
        "use strict";

        return function () {
            var thisObj = this,
                time,
                transform,
                rotationSpeed = 0.0001,
                upDownSpeed = 0.00005,
                wheelSpeed = 0.0001,
                mouseRotationSpeed = 0.01,
                mouseInput,
                vec3 = kick.math.Vec3,
                quat = kick.math.Quat,
                cartesianCoordinates = vec3.create(),
                sphericalCoordinates = vec3.clone([3, 0, 0]),
                objectCenter = vec3.create();

            this.activated = function () {
                var gameObject = thisObj.gameObject,
                    engine = kick.core.Engine.instance;
                transform = gameObject.transform;
                time = engine.time;
                mouseInput = engine.mouseInput;
                mouseInput.mouseWheelPreventDefaultAction = true;
            };

            this.update = function () {
                var mouseDelta,
                    wheelY,
                    delta;
                if (mouseInput.isButton(0)) {
                    mouseDelta = mouseInput.deltaMovement;
                    sphericalCoordinates[1] -= mouseDelta[0] * mouseRotationSpeed;
                    sphericalCoordinates[2] += mouseDelta[1] * mouseRotationSpeed;
                    sphericalCoordinates[2] = Math.max(-Math.PI * 0.499, sphericalCoordinates[2]);
                    sphericalCoordinates[2] = Math.min(Math.PI * 0.499, sphericalCoordinates[2]);
                } else {
                    sphericalCoordinates[1] += time.deltaTime * rotationSpeed;
                    sphericalCoordinates[2] = Math.sin(time.time * upDownSpeed) * Math.PI * 0.25;
                }
                wheelY = mouseInput.deltaWheel[1];
                if (wheelY) {
                    delta = wheelY * wheelSpeed;
                    sphericalCoordinates[0] *= 1 + delta;
                }
                vec3.sphericalToCarterian(cartesianCoordinates, sphericalCoordinates);
                cartesianCoordinates = vec3.add(cartesianCoordinates, objectCenter, cartesianCoordinates);
                transform.position = cartesianCoordinates;
                transform.localRotation = quat.lookAt(quat.create(), cartesianCoordinates, objectCenter, [0, 1, 0]);
            };
        }
    });
