define(["kick"],
    function (kick) {
        "use strict";

        return function () {
            var engine = kick.core.Engine.instance;

            return engine.project.load(engine.project.ENGINE_TEXTURE_WHITE);
        };
    });
