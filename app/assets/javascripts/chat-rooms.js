$( document ).ready(function() {

    var username;

    jQuery.fn.exists = function () {
        return ($(this).length > 0);
    }


    MessageBus.ajax = function (args) {
        args["headers"]["X-username"] = username;
        return $.ajax(args);
    };

    var enter = function (username, opts) {

        var li = $('#users ul').find("li[data-name='" + username + "']").detach();
        if (!li.exists()) {
            li = $('<li></li>');
            li.text(username);
            li.attr('data-name', username);
        }

        if (opts && opts.me) {
            li.addClass("me");
            $('#users ul').prepend(li);
        } else {
            $('#users ul').append(li);
        }
    };

    $('#messages, #panel').addClass('hidden');

    $('#your-username input').keyup(function (e) {
        if (e.keyCode == 13) {
            var newname = $(this).val();
            $.post("/enter", { username: newname}, null, "json").success(function (data) {
                //initial load of users on presence list
                $.each(data.users, function (uname, utime) {
                    enter(uname, { me: (uname == newname) });
                });
                //initial set for global username
                username = data.username;
            });
            $('#your-username').addClass('hidden');
            $('#messages, #panel, #users').removeClass('hidden');
            $(document.body).scrollTop(document.body.scrollHeight);

            window.onbeforeunload = function () {
                $.post("/leave", { username: username });
            };

            MessageBus.subscribe("/presence", function (msg) {
                if (msg.enter) {
                    enter(msg.enter, {me: (msg.enter == username)});
                }
                if (msg.leave) {
                    $('#users ul li').each(function () {
                        if ($(this).text() === msg.leave) {
                            $(this).remove()
                        }
                    });
                }
            });
        }
    });

    var safe = function (html) {
        return String(html).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    MessageBus.subscribe("/message", function (msg) {
        $('#messages').append("<p>" + safe(msg.username) + " said: " + safe(msg.data) + "</p>");
        $(window).scrollTop(document.body.scrollHeight);
    }, 0); // last id is zero, so getting backlog

    var submit = function () {
        var val = $('form textarea').val().trim();
        if (val.length === 0) {
            return;
        }

        if (val.length > 500) {
            alert("message too long");
            return false;
        } else {
            $.post("/message", { data: val, username: username});
        }
        $('textarea').val("");
    };

    $('#send').click(function () {
        submit();
        return false;
    });

    $('textarea').keyup(function (e) {
        if (e.keyCode == 13) {
            submit();
        }
    });

});