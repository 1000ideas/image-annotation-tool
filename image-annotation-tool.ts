namespace ImageAnnotationTool
{
    export class Settings 
    {
        toolbarCssClass:string = 'iat-toolbar';
        sceneCssClass:string = 'iat-scene';
        containerCssClass:string = 'iat-container';
        hiddenCssClass:string = 'iat-hidden';
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
                       <button data-action="add-image">Add image</button>         
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
        
        public constructor(settings:Settings)
        {
            this.dots = [];
            this.container = document.createElement('div');
            this.container.classList.add(settings.sceneCssClass);
        }
    }
    
    export class Widget
    {
        container:HTMLDivElement;
        toolbar:Toolbar;
        scene:Scene;
        settings:Settings;
        
        public initOnTextarea(textarea:HTMLTextAreaElement, runtimeSettings:any = {})
        {
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
        }
        
        public onAddDotEvent(event:Event)
        {
            this.scene.dots.push(new Dot(50, 50, "Example Dot " + String(this.scene.dots.length)));
            console.log(this.scene.dots);
        }
    }
}
