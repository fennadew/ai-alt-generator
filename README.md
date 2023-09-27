# AI alt image generator

Since many content editors overlook alt text for images in the CMS, I'm creating a brief POC to explore AI-generated alt text from uploaded images. This is before diving into developing a full CMS plugin.

## How it works

It uses the [Hugging Face Interface API](https://huggingface.co/inference-api) together with different Image-to-Text models to generate alt text for images. You can upload any image to the form, and pick between different models. It will return a description of that image.

## Conclusion

The models are not reliable enough (yet) to create a CMS plugin
