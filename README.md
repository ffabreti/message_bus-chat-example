# message_bus-chat-example
Rails 4.1 + Postgresql 9 + Puma + message_bus 2.0.0.beta

MessageBus Repo: https://github.com/SamSaffron/message_bus

## How to use


### 1) Download from one branch:

>In the **master branch**,    you find the Jquery version:

`$ git clone -b master    https://github.com/ffabreti/message_bus-chat-example.git`

> In the **angularJS branch**, you will find the AngularJS version.
MessageBus Jquery client was converted to AngularJS.
There is no Jquery dependency. You can find [a initial diff here](https://github.com/ffabreti/message_bus-chat-example/commit/2cf8a138cdf572868ec64b908ca6d95b127ae774).

`git clone -b angularJS https://github.com/ffabreti/message_bus-chat-example.git`

> In the **messageBusAjax-angular** branch, you will find original message-bus.js and the new 
message-bus-ajax.js which completely eliminates the need for converting code to 
AngularJS inside the message-bus code.
Including message-bus-ajax.js will provide a native javascript XMLHttpRequest 
instead of JQuery.ajax implementation.  

`git clone -b messageBusAjax-angular https://github.com/ffabreti/message_bus-chat-example.git`

### 2) Install Postgres 9
> You may find [more info here](https://wiki.postgresql.org/wiki/Detailed_installation_guides) 

### 3) Bundle it
`$ bundle install`

### 4) Migrate it
`$ rake db:migrate`

### 5) Run Rails Server
> You may want to run the fake_production environment so that you get thread safe, puma threads, concurrency, etc

`$ rails server -e fake_production` or `$ passenger start -e fake_production`

### 6) Run Clients
Open up 2 different browsers and point then to `http://localhost:3000`

