## user-welcome-message

This is user welcome message webpart that can be used to display welcome message on SharePoint pages.

This webpart has basic two main elements-
1. First paragraph/line displays message "Welcome `UserDisplayName` to the `SiteTitle` site!"
	In this UserDisplayName is Display name for current user fetched from current user conntext from AD.
2. Second paragraph is custom muliline message you can enter by editing webpart from PropertPane Description field.
	If Description field is kept blank then this section will not display.

Webpart background color will be same as your current selected theme color.

You can modify webpart as your need. Feel free to share your further customizations with me to the webpart.

If any issue then please create an issue in the repository.


To build and test webpart follow below steps:

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
