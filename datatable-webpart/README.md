## datatable-webpart

This is DataTable webpart for displaying SP list data.
As a customization we largely used to use DataTables with REST APIs in previous versions of SharePoint.

This webpart is capable of fetching lists from a deployed site and based on the selected list it automatically fecthes list fields which can be selected to populate DataTable.

This webpart uses Jquery and DataTable libraries.

Configuration:
1. Deploy webpart in app catalog after packaging.
2. Install webpart app in site collection.
3. In a page select this webpart from list and click on edit webpart button to configure webpart.
4. In a configuration pane you have multiple options - 1. Title for your webpart. 2. List to selected 3. Fields to be selected(multiselect dropdown).
5. Your DataTable webbpart will be avaialble after configuration.

Current Limitations:
1. Does not support complex fields such as People Picker, Rich multiple line text field etc.
2. Can be used once in a single page. (Development is progress for multiple support)
3. No options to customize DataTable. (Will be adding more customization in future)


You can use this to customize code as per your need. 
Please log issues in issue tracker.

Enjoy coding.

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
