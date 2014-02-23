# Vayu [![Code Climate](https://codeclimate.com/github/maheshj567/vayu.png)](https://codeclimate.com/github/maheshj567/vayu) [![Dependency status](https://gemnasium.com/maheshj567/vayu.png)](https://gemnasium.com/maheshj567/vayu) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/maheshj567/vayu/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

It started off a project to help myself understand Backbone.js. Now I'm working on making it into a full featured app. The roadmap is a little fuzzy right now. I'm just adding whatever features that are on my mind.

Got any ideas? Or just say hi? Get in touch [@maheshj567](http://twitter.com/maheshj567).

[Try out the app](http://vayu.io)

## Current feature set

1. Create/edit boards
2. Create/edit/delete cards
3. Create/edit/delete/finish todos
4. Login using Facebook

## Stack

1. **Backbone.js** for app logic
2. **Requirejs** for AMD (Asynchronous Module Definition) style JS code
3. **Zurb Foundation** framework for UI
4. **HTML5** localstorage APIs (not using from v0.4)
5. **Express (Node.js)** for backend
6. **MongoDB** for storing data
7. **Redis** for session store
8. **Openshift by Redhat** for hosting 

## Limitations

Works properly in Chrome only

## Roadmap

* New design
* Search
* User timezone support
* Attach deadlines to todos
* Reminders
* Cards should be dealt as tags, instead of mutually exclusive containers
* More views for todos - timeline, list
* Proper build/deployment process
* Mobile

## License

Apache License, Version 2.0

## Progress

### v0.5

* Edit and delete todos
* Edit and delete cards
* Finished on 22 Feb, 14

### v0.4

* Upgraded to Foundation 5
* MongoDB backend
* Redis for session management
* FB login integration
* Server side integration
* Finished on 14 Feb, '14'

### v0.3

* Changed name and hosting
* Changed logo
* added a lot of details to README
* Finished on 12 Dec, '13

### v0.2

* using JSON.stringify to encode data instead of manually building the string - fixes bugs related to JSON encoding
* edit board and card name
* Finished on 23 Nov, '13

### v0.1

* Cards are added to the list at the top (rather) than at the bottom
* Used require.js to create a modular application structure - separate views and models

### v0

* Add boards
* Add cards
* Add todo's
* Reset everything
* Store data in LocalStorage
* Finished on 07 Oct, '12