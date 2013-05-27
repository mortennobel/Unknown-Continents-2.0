var debug = location.search === "?debug";

requirejs.config({
    baseUrl: '.',
    paths: {
        kick: debug ? 'js/libs/kick-debug': 'js/libs/kick',
        text: 'js/libs/text',
        uc2: 'js/uc2'
    },
    waitSeconds: 30
});

requirejs(['kick', 'uc2/SceneFactory'],
    function (kick,SceneFactory) {
        new kick.core.Engine('canvas', {
            enableDebugContext: debug
        });
        SceneFactory();
    },
    function(err){
        var domElement = document.getElementById('canvas');
        domElement.innerHTML = "";
        domElement.width = window.innerWidth;
        domElement.height = window.innerHeight - domElement.offsetTop;
        errorMessage = document.createElement("div");
        errorMessage.style.cssText = domElement.style.cssText + ";width:" + domElement.width + "px;height:" + domElement.height +
            "px;display: table-cell;vertical-align: middle;background:#ffeeee;";
        errorMessage.innerHTML = "<div style='padding:12px;text-align: center;'>Error loading WebGL application</div>";
        domElement.parentNode.replaceChild(errorMessage, domElement);
        console.log(err);
    }
);