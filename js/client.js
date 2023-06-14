var idBuscado = 0;


function cleanClient() {
    $("#name").val("");
    $("#email").val("");
    $("#age").val("");
    $("#password").val("");
}

function consultarClient() {

    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Client/all",
        type: "GET",
        dataType: "json",
        success: function (respose) {
            $("#contenidoTablaClient").empty();
            respose.forEach(element => {
                var row = $("<tr>");
                row.append($("<td>").text(element.email));
                row.append($("<td>").text(element.name));
                row.append($("<td>").text(element.age));

                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" data-bs-target="#updateClientModal" data-bs-toggle="modal" onclick="buscarClient(' + element.idClient + ')">Editar</button>'));
                row.append($("<td class='text-center'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onclick="eliminarClient(' + element.idClient + ',\'' + element.name + '\')">Eliminar</button>'));
                $("#contenidoTablaClient").append(row);
            });
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}

function crearClient() {

    if ($("#email").val().length == 0 || $("#password").val().length == 0 || $("#name").val().length == 0 || $("#age").val().length == 0) {
        alert("All fields are required")
    } else {
        var email = $("#email").val();
        var password = $("#password").val();
        var name = $("#name").val();
        var age = $("#age").val();

        var data = {
            email: email,
            password: password,
            name: name,
            age: age,

        };

        $.ajax({
            url: "https://desarrollonube.azurewebsites.net/api/Client/save",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                201: function () {
                    $("#email").val("");
                    $("#password").val("");
                    $("#name").val("");
                    $("#age").val("");
                    alert("Successfully created!!");
                    consultarClient();
                },
                500: function () {
                    alert("An error has occurred!!");
                }
            }
        });
    }
}


function actualizarClient() {
    var id = idBuscado;
    var email = $("#emailUpdateClient").val();
    var password = $("#passwordUpdateClient").val();
    var name = $("#nameUpdateClient").val();
    var age = $("#ageUpdateClient").val();



    var data = {
        idClient: id,
        email: email,
        password: password,
        name: name,
        age: age,

    };
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Client/update",
        type: "PUT",
        dataType: "json",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function () {
                idBuscado = 0;
                $("#emailUpdateClient").val("");
                $("#passwordUpdateClient").val("");
                $("#nameUpdateClient").val("");
                $("#ageUpdateClient").val("");
                consultarClient();
            }
        }
    });
}


function eliminarClient(id, name) {
    var r = confirm("Are you sure to delete the client: " + name + " ?");
    if (r == true) {
        var data = {
            id: id
        };

        $.ajax({
            url: "https://desarrollonube.azurewebsites.net/api/Client/" + id,
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function () {

                    consultarClient();
                }
            }
        });
    }
}


function buscarClient(id) {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Client/" + id,
        type: "GET",
        dataType: "json",
        success: function (respose) {
            if (respose.idClient != null) {
                idBuscado = respose.idClient;
                $("#emailUpdateClient").val(respose.email);
                $("#passwordUpdateClient").val(respose.password);
                $("#nameUpdateClient").val(respose.name);
                $("#ageUpdateClient").val(respose.age);
            } else {
                alert("The record was not found!!");
            }
        },
        error: function (xhr, status) {
            alert("An error has occurred");
        }
    });
}



$(document).ready(function () {


    consultarClient();
});