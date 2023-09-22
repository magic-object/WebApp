var user_id = '0';

function is_name_duplicate(name)
{
    if(name == "" ) {
        return true;
    }

    $.ajax({
        type: "POST",
        url: "/is_name_duplicate",
        dataType: "json",
        data : {
            "user_id": user_id,
            "name": name
        }
    }).done(function(data, textStatus, jqXHR) {
        if(data == null) {
            return true;
        } else {
            return data["duplicate"];
        }
    }).fail(function(jqXHR, textStatus, errorThrown){
            return true;
    });
}

function is_email_duplicate(email)
{
    if(email == "" ) {
        return true;
    }

    $.ajax({
        type: "POST",
        url: "/is_email_duplicate",
        dataType: "json",
        data : {
            "user_id": user_id,
            "email": email
        }
    }).done(function(data, textStatus, jqXHR) {
        if(data == null) {
            return true;
        } else {
            return data["duplicate"];
        }
    }).fail(function(jqXHR, textStatus, errorThrown){
            return true;
    });
}

function validate()
{
        var regexp = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
        var ok = true;

        if( $("#nickName").val().length < 1 ) {
            $("#nickName").removeClass("is-valid");
            $("#nickName").addClass("is-invalid");
            ok = false;
        } else if(is_name_duplicate($("#nickName").val())) {
            $("#nickName").removeClass("is-valid");
            $("#nickName").addClass("is-invalid");
            ok = false;
        } else {
            $("#nickName").removeClass("is-invalid");
            $("#nickName").addClass("is-valid");
        }

        if( $("#password").val().length < 7 ) {
            $("#password").removeClass("is-valid");
            $("#password").addClass("is-invalid");
            ok = false;
        } else {
            $("#password").removeClass("is-invalid");
            $("#password").addClass("is-valid");
        }

        if( regexp.test($("#email").val()) ) {
            if(is_email_duplicate($("#email").val())) {
                $("#email").removeClass("is-valid");
                $("#email").addClass("is-invalid");
                ok = false;
            }
            else {
                $("#email").removeClass("is-invalid");
                $("#email").addClass("is-valid");
            }
        } else {
            $("#email").removeClass("is-valid");
            $("#email").addClass("is-invalid");
            ok = false;
        }

        if( ok ) {
            $("#register-btn").prop("disabled", false);
        } else {
            $("#register-btn").prop("disabled", true);
        }
}

function login_validate()
{
        var ok = true;
        if( $("#loginNickName").val().length > 1 && $("#loginPassword").val().length >= 7 ) {
            $("#login-btn").prop("disabled", false);
        } else {
            $("#login-btn").prop("disabled", true);
        }
}

$(document).ready(function(){

    $.ajax({
        type: "POST",
        url: "/user_get",
        dataType: "json"
    }).done(function(data, textStatus, jqXHR) {
        if(data == null) {
        } else if(data["id"] == '') {
            user_id = '0';
        }
        else {
            $("#nickName").val(data["name"]);
            $("#password").val(data["password"]);
            $("#email").val(data["email"]);
            user_id = data["id"];
            validate();
        }
    }).fail(function(jqXHR, textStatus, errorThrown){
    });

    validate();

    $.ajax({
        type: "POST",
        url: "/is_signin",
        dataType: "json"
    }).done(function(data, textStatus, jqXHR) {
        if(data == null) {
        } else if(data["signin"]) {
            $("#loginForm").addClass("d-none")
            $("#action-box").removeClass("d-none")
        }
        else {
            $("#loginForm").removeClass("d-none")
            $("#action-box").addClass("d-none")
        }
    }).fail(function(jqXHR, textStatus, errorThrown){
    });

    $(".register-item").keyup(function() {
        validate();
    });

    $(".register-item").change(function() {
        validate();
    });

    $("#register-btn").click(function() {
        $("#register-btn-spinner").removeClass("d-none")
        $.ajax({
            type: "POST",
            url: "/register",
            dataType: "json",
            data : {
                "user_id": user_id,
                "name": $("#nickName").val(),
                "password": $("#password").val(),
                "email": $("#email").val(),
                "limit": $("#limit").val()
            }
        }).done(function(data, textStatus, jqXHR) {
            if(data == null) {
            } else if(data["result"]) {
                user_id = data["user_id"];
            } else {
            }
            $("#register-btn-spinner").addClass("d-none")
        }).fail(function(jqXHR, textStatus, errorThrown){
            $("#register-btn-spinner").addClass("d-none")
        });
    });

    $(".login-item").keyup(function() {
        login_validate();
    });

    $(".login-item").change(function() {
        login_validate();
    });
});