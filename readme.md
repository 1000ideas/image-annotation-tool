# image-annotation-tool
Tool for annotating images / experiment

This is JS / HTML component that lets you comment areas of previously loded image and save resulting markup / annotations data as HTML or JSON.

You can use it in few different ways:

JSON mode:

In this mode you are responsible for integrating this component with your page. 

Form mode:

In this mode editor is created using existing input elements / textarea. When editor is instantited it replaces existing inputs.

TODO:
- [ ] Add ability to load image to the scene as background or <img> using JS File API 
- [ ] Add option for adding annotation points on the scene
- [ ] Create save method - create JSON structure that describes edited scene (image data + annotation points)  
- [ ] Add ability to edit text - each annotation dot should have corresponding textarea / content editable 

