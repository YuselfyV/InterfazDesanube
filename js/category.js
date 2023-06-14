var idBuscado = 0;


function cleanCategory() {
    $("#name").val("");
    $("#category").val("");
}


function consultarCategory() {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Category/all",
        type: "GET",
        dataType: "json",
        success: function (respose) {
            $("#contenidoTablaCategory").empty();
            respose.forEach(element => {
                var row = $("<tr>");
                row.append($("<td>").text(element.name));
                row.append($("<td>").text(element.description));

                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" data-bs-target="#updateCategoryModal" data-bs-toggle="modal" onclick="buscarCategory(' + element.id + ')">Editar</button>'));
                row.append($("<td class='text-center'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onclick="eliminarCategory(' + element.id + ',\'' + element.name + '\')">Eliminar</button>'));
                $("#contenidoTablaCategory").append(row);
            });
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}

function crearCategory() {


    if($("#name").val().length == 0 || $("#category").val().length == 0 ){
        alert("All fields are required")
    }else{  
    var name = $("#name").val();
    var description = $("#category").val();

    var data = {
        name: name,
        description: description,

    };

    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Category/save",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function () {
                $("#name").val("");
                $("#category").val("");
                alert("Successfully created!!");
                consultarCategory();
            },
            500: function () {
                alert("An error has occurred!!");
            }
        }
    });
}

}

function actualizarCategory() {
    var id = idBuscado;
    var name = $("#nameUpdateCategory").val();
    var description = $("#categoryUpdateCategory").val();


    var data = {
        id: id,
        name: name,
        description: description,

    };
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Category/update",
        type: "PUT",
        dataType: "json",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function () {
                idBuscado = 0;
                $("#nameUpdateCategory").val("");
                $("#categoryUpdateCategory").val("");
                consultarCategory();
            }
        }
    });
}


function eliminarCategory(id, name) {
    var r = confirm("Are you sure to delete the named cloud: " + name + " ?");
    if (r == true) {
        var data = {
            id: id
        };

        $.ajax({
            url: "https://desarrollonube.azurewebsites.net/api/Category/" + id,
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function () {

                    consultarCategory();
                }
            }
        });
    }
}


function buscarCategory(id) {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Category/" + id,
        type: "GET",
        dataType: "json",
        success: function (respose) {
            if (respose.id != null) {
                idBuscado = respose.id;
                $("#nameUpdateCategory").val(respose.name);
                $("#categoryUpdateCategory").val(respose.description);
            } else {
                alert("The record was not found!!");
            }
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}

$(document).ready(function () {


    consultarCategory();
});