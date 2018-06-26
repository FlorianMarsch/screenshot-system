# Screenshotr
screenshotr is a service do make screenshots of your favourite web pages.


```js
{
	"url":"https://internet/",
	"zoom":0.5,
	"viewportSize" : { "width": 600, "height": 800 }
	"querySelector" : ".YourClassnameToSnapshot"
}
```


Verify the deployment by navigating to your server address in your preferred browser.

```sh
Post 127.0.0.1:5001/api/screenshot
```