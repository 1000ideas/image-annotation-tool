var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ImageAnnotationTool;
(function (ImageAnnotationTool) {
    var Settings = (function () {
        function Settings() {
            this.toolbarCssClass = 'iat-toolbar';
            this.sceneCssClass = 'iat-scene';
            this.containerCssClass = 'iat-container';
            this.hiddenCssClass = 'iat-hidden';
            this.imageMode = 'img';
            this.acceptedImageTypes = ['image/jpeg', 'image/png'];
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
            this.markup = "\n          \n                <ul>\n                    <li>\n                       <button data-action=\"set-image\">Add image</button>         \n                    </li>\n                    <li>\n                       <button data-action=\"add-dot\">Add dot</button>         \n                    </li>       \n                </ul>\n            \n        ";
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
    var FileInput = (function () {
        function FileInput(settings) {
            this.settings = settings;
            this.element = document.createElement('input');
            this.element.type = 'file';
            this.element.addEventListener("change", this.onFileChange.bind(this));
            this.element.classList.add(settings.hiddenCssClass);
        }
        FileInput.prototype.onFileChange = function (event) {
            var file = this.element.files.item(0);
            if (!file || this.settings.acceptedImageTypes.indexOf(file.type) < 0) {
                return;
            }
            this.element.dispatchEvent(new Event('image-change'));
        };
        return FileInput;
    }());
    ImageAnnotationTool.FileInput = FileInput;
    var ImageElement = (function () {
        function ImageElement() {
        }
        ImageElement.create = function (type) {
            var element;
            switch (type) {
                case ImageElement.IMG:
                    element = new ImgImage();
                    break;
                case ImageElement.BACKGROUND:
                    element = new BackgroundImage();
                    break;
                default:
                    throw new Error('Unexpected image mode received: ' + String(type));
            }
            return element;
        };
        ImageElement.IMG = 'img';
        ImageElement.BACKGROUND = 'background';
        return ImageElement;
    }());
    ImageAnnotationTool.ImageElement = ImageElement;
    var ImgImage = (function (_super) {
        __extends(ImgImage, _super);
        function ImgImage() {
            _super.call(this);
            this.element = document.createElement('img');
        }
        ImgImage.prototype.setImage = function (image) {
            console.log('setting image as img element');
            this.element.src = image;
        };
        return ImgImage;
    }(ImageElement));
    ImageAnnotationTool.ImgImage = ImgImage;
    var BackgroundImage = (function (_super) {
        __extends(BackgroundImage, _super);
        function BackgroundImage() {
            _super.call(this);
            this.element = document.createElement('div');
        }
        BackgroundImage.prototype.setImage = function (image) {
            console.log('setting image as background', image);
        };
        return BackgroundImage;
    }(ImageElement));
    ImageAnnotationTool.BackgroundImage = BackgroundImage;
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
            this.image = ImageElement.create(settings.imageMode);
            this.container.appendChild(this.image.element);
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
            textarea.classList.add(this.settings.hiddenCssClass);
            textarea.parentNode.insertBefore(this.container, textarea.nextSibling);
            this.fileInput = new FileInput(this.settings);
            this.container.appendChild(this.fileInput.element);
            this.toolbar.container.addEventListener('add-dot', this.onAddDotEvent.bind(this));
            this.toolbar.container.addEventListener('set-image', this.onSetImageEvent.bind(this));
            this.fileInput.element.addEventListener('image-change', this.onImageChangeEvent.bind(this));
        };
        Widget.prototype.onImageChangeEvent = function (event) {
            var image = this.fileInput.element.files.item(0);
            var reader = new FileReader();
            reader.addEventListener('load', this.onImageDataLoaded.bind(this));
            reader.readAsDataURL(image);
        };
        Widget.prototype.onImageDataLoaded = function (event) {
            var url = event.target.result;
            this.scene.image.setImage(url);
        };
        Widget.prototype.onSetImageEvent = function (event) {
            event.preventDefault();
            this.fileInput.element.click();
        };
        Widget.prototype.onAddDotEvent = function (event) {
            this.scene.dots.push(new Dot(50, 50, "Example Dot " + String(this.scene.dots.length)));
            console.log(this.scene.dots);
        };
        return Widget;
    }());
    ImageAnnotationTool.Widget = Widget;
})(ImageAnnotationTool || (ImageAnnotationTool = {}));
