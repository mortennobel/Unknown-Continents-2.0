var debug = location.search === "?debug";

requirejs.config({
    baseUrl: '.',
    paths: {
        kick: debug ? 'js/libs/kick-debug': 'js/libs/kick',
        text: 'js/libs/text',
        uc2: 'js/uc2'
    }
});

requirejs(['kick', 'uc2/SceneBuilder'],
    function (kick,SceneBuilder) {
        var engine = new kick.core.Engine('canvas', {
            enableDebugContext: debug
        });
        SceneBuilder(engine);
    }
);