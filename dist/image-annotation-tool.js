var ImageAnnotationTool;
(function (ImageAnnotationTool) {
    var Settings = (function () {
        function Settings() {
            this.toolbarCssClass = 'iat-toolbar';
            this.sceneCssClass = 'iat-scene';
            this.containerCssClass = 'iat-container';
            this.hiddenCssClass = 'iat-hidden';
        }
        Settings.createFromObject = function (o) {
            var s = new Settings();
            for (var field in s) {
                if (typeof o[field] !== "undefined") {
                    s[field] = o[field];
                }
            }
            return s;
        };
        return Settings;
    }());
    ImageAnnotationTool.Settings = Settings;
    var Toolbar = (function () {
        function Toolbar(settings) {
            this.markup = "\n          \n                <ul>\n                    <li>\n                       <button data-action=\"add-image\">Add image</button>         \n                    </li>\n                    <li>\n                       <button data-action=\"add-dot\">Add dot</button>         \n                    </li>       \n                </ul>\n            \n        ";
            this.container = document.createElement('div');
            this.container.classList.add(settings.toolbarCssClass);
            this.container.innerHTML = this.markup;
            this.container.addEventListener("click", this.onToolbarClick.bind(this));
        }
        Toolbar.prototype.onToolbarClick = function (event) {
            var action = event.target.getAttribute('data-action');
            if (!action) {
                return;
            }
            this.container.dispatchEvent(new Event(action));
        };
        return Toolbar;
    }());
    ImageAnnotationTool.Toolbar = Toolbar;
    var Dot = (function () {
        function Dot(x, y, label) {
            this.x = x;
            this.y = y;
            this.label = label;
        }
        return Dot;
    }());
    ImageAnnotationTool.Dot = Dot;
    var Scene = (function () {
        function Scene(settings) {
            this.dots = [];
            this.container = document.createElement('div');
            this.container.classList.add(settings.sceneCssClass);
        }
        return Scene;
    }());
    ImageAnnotationTool.Scene = Scene;
    var Widget = (function () {
        function Widget() {
        }
        Widget.prototype.initOnTextarea = function (textarea, runtimeSettings) {
            if (runtimeSettings === void 0) { runtimeSettings = {}; }
            this.settings = Settings.createFromObject(runtimeSettings);
            this.container = document.createElement('div');
            this.container.classList.add(this.settings.containerCssClass);
            this.toolbar = new Toolbar(this.settings);
            this.scene = new Scene(this.settings);
            this.container.appendChild(this.toolbar.container);
            this.container.appendChild(this.scene.container);
            this.toolbar.container.addEventListener('add-dot', this.onAddDotEvent.bind(this));
            textarea.classList.add(this.settings.hiddenCssClass);
            textarea.parentNode.insertBefore(this.container, textarea.nextSibling);
        };
        Widget.prototype.onAddDotEvent = function (event) {
            this.scene.dots.push(new Dot(50, 50, "Example Dot " + String(this.scene.dots.length)));
            console.log(this.scene.dots);
        };
        return Widget;
    }());
    ImageAnnotationTool.Widget = Widget;
})(ImageAnnotationTool || (ImageAnnotationTool = {}));
