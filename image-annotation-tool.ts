namespace ImageAnnotationTool
{
    export class Settings 
    {
        toolbarCssClass:string = 'iat-toolbar';
        sceneCssClass:string = 'iat-scene';
        containerCssClass:string = 'iat-container';
        hiddenCssClass:string = 'iat-hidden';
        imageMode:string = 'img';
        acceptedImageTypes:Array<string> = ['image/jpeg', 'image/png'];
        [field:string]:any;
        
        static createFromObject(o:any):Settings
        {
            let s = new Settings();
            
            for (let field in s)
            {
                if (typeof o[field] !== "undefined")
                {
                    s[field] = o[field];
                }
            }
                
            return s;
        }
    }
    
    export class Toolbar
    {
        container:HTMLElement;
        
        markup:string = `
          
                <ul>
                    <li>
                       <button data-action="set-image">Add image</button>         
                    </li>
                    <li>
                       <button data-action="add-dot">Add dot</button>         
                    </li>       
                </ul>
            
        `;
        
        public onToolbarClick(event:UIEvent)
        {
            let action:string|null = (event.target as Element).getAttribute('data-action');
            
            if (!action)
            {
                return;
            }
            
            this.container.dispatchEvent(new Event(action))
        }
        
        public constructor(settings:Settings)
        {
            this.container = document.createElement('div');
            this.container.classList.add(settings.toolbarCssClass);            
            this.container.innerHTML = this.markup;
            this.container.addEventListener("click", this.onToolbarClick.bind(this));
        }
    }

    export class FileInput
    {
        element:HTMLInputElement;
        settings:Settings;
        
        constructor(settings:Settings)
        {
            this.settings = settings;
            this.element = document.createElement('input');
            this.element.type = 'file';
            this.element.addEventListener("change", this.onFileChange.bind(this));
            this.element.classList.add(settings.hiddenCssClass);
        }
        
        public onFileChange(event:Event)
        {
            let file:File|null = this.element.files.item(0);
           
            if (!file || this.settings.acceptedImageTypes.indexOf(file.type) < 0)
            {
               return;
            }

            this.element.dispatchEvent(new Event('image-change'))
        }
    }
        
    export abstract class ImageElement
    {
        static IMG:string = 'img';
        static BACKGROUND:string = 'background';
        
        element:HTMLElement;
        
        abstract setImage(data:string):void;        
        
        static create(type:string):ImageElement
        {
            let element:ImageElement;
            
            switch (type)
            {
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
        }
    }
    
    export class ImgImage extends ImageElement
    {
        element:HTMLImageElement;
        
        constructor()
        {
            super();
            this.element = document.createElement('img');
        }
        
        setImage(image:string):void
        {
            console.log('setting image as img element');
            this.element.src = image;
        }
    }
    
    export class BackgroundImage extends ImageElement
    {
        constructor()
        {
            super();
            this.element = document.createElement('div');
        }
        
        setImage(image:string):void
        {
            console.log('setting image as background', image)
        }
    }
    
    export class Dot
    {
        x:number;
        y:number;
        label:string;
        container:HTMLElement;

        constructor(x: number, y: number, label: string)
        {
            this.x = x;
            this.y = y;
            this.label = label;
        }
    }

    export class Scene
    {
        container:HTMLElement;
        dots:Array<Dot>;
        image:ImageElement;
        
        public constructor(settings:Settings)
        {
            this.dots = [];
            this.container = document.createElement('div');
            this.container.classList.add(settings.sceneCssClass);
            this.image = ImageElement.create(settings.imageMode);
            this.container.appendChild(this.image.element);
        }
    }
    
    export class Widget
    {
        container:HTMLDivElement;
        toolbar:Toolbar;
        scene:Scene;
        settings:Settings;
        fileInput:FileInput;
        image:ImageElement;
        
        public initOnTextarea(textarea:HTMLTextAreaElement, runtimeSettings:any = {})
        {
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
        }

        public onImageChangeEvent(event:Event)
        {
            let image:File = this.fileInput.element.files.item(0);
            var reader = new FileReader();
            reader.addEventListener('load', this.onImageDataLoaded.bind(this));
            reader.readAsDataURL(image);           
        }
        
        public onImageDataLoaded(event:Event)
        {
            let url:string = event.target.result as string;
            this.scene.image.setImage(url);
        }
        
        public onSetImageEvent(event:Event)
        {
            event.preventDefault();
            this.fileInput.element.click();
        }
        
        public onAddDotEvent(event:Event)
        {
            this.scene.dots.push(new Dot(50, 50, "Example Dot " + String(this.scene.dots.length)));
            console.log(this.scene.dots);
        }
    }
}
