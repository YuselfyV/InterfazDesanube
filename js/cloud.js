var idBuscado = 0;



function cleanCloud() {
    $("#nameCloud").val("");
    $("#brand").val("");
    $("#year").val("");
    $("#description").val("");
    $("#category").val(0);
}

function consultarCloud() {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Cloud/all",
        type: "GET",
        dataType: "json",
        success: function (respose) {
            $("#contenidoTablaCloud").empty();
            respose.forEach(element => {
                var row = $("<tr>");
                row.append($("<td>").text(element.name));
                row.append($("<td>").text(element.brand));
                row.append($("<td>").text(element.year)); +
                    row.append($("<td>").text(element.description));
                row.append($("<td>").text(element.category.name));

                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" data-bs-target="#updateCloudModal" data-bs-toggle="modal" onclick="buscarCloud(' + element.id + ')">Editar</button>'));
                row.append($("<td class='text-center'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onclick="eliminarCloud(' + element.id + ',\'' + element.name + '\')">Eliminar</button>'));
                $("#contenidoTablaCloud").append(row);
            });
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}


function cargarCategory() {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Category/all",
        type: "GET",
        dataType: "json",
        success: function (respose) {

            $(".category").each(function () {
                $(this).empty();
                $(this).append($("<option>").val(0).text("Select a category"));

                respose.forEach(element => {
                    $(this).append($("<option>").val(element.id).text(element.name));
                });
            });
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}


function crearCloud() {
    if ($("#nameCloud").val().length == 0 || $("#brand").val().length == 0 || $("#year").val().length == 0 || $("#description").val().length == 0 || $("#category").val().length == 0) {
        alert("All fields are required!!")
    } else {
        var name = $("#nameCloud").val();
        var brand = $("#brand").val();
        var year = $("#year").val();
        var description = $("#description").val();
        var category_id = $("#category").val();

        var data = {
            name: name,
            brand: brand,
            year: year,
            description: description,
            category: {
                id: category_id
            }
        };

        $.ajax({
            url: "https://desarrollonube.azurewebsites.net/api/Cloud/save",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                201: function () {
                    $("#nameCloud").val("");
                    $("#brand").val("");
                    $("#year").val("");
                    $("#description").val("");
                    $("#category").val(0);
                    alert("Successfully created!!");
                    consultarCloud();
                },
                500: function () {
                    alert("An error has occurred!!");
                }
            }
        });
    }
}

function actualizarCloud() {
    var id = idBuscado;
    var name = $("#nameUpdateCloud").val();
    var brand = $("#brandUpdateCloud").val();
    var year = $("#yearUpdateCloud").val();
    var description = $("#descriptionUpdateCloud").val();
    var category_id = $("#categoryUpdateCloud").val();

    var data = {
        id: id,
        name: name,
        brand: brand,
        year: year,
        description: description,
        category: {
            id: category_id
        }
    };
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Cloud/update",
        type: "PUT",
        dataType: "json",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function () {
                idBuscado = 0;
                $("#nameUpdateCloud").val("");
                $("#brandUpdateCloud").val("");
                $("#yearUpdateCloud").val("");
                $("#descriptionUpdateCloud").val("");
                $("#categoryUpdateCloud").val(0);
                consultarCloud();
            }
        }
    });
}


function eliminarCloud(id, name) {
    var r = confirm("Segur@ de eliminar la nube: con nombre: " + name);
    if (r == true) {
        var data = {
            id: id
        };

        $.ajax({
            url: "https://desarrollonube.azurewebsites.net/api/Cloud/" + id,
            type: "DELETE",
            dataType: "json",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function () {

                    consultarCloud();
                }
            }
        });
    }
}


function buscarCloud(id) {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Cloud/" + id,
        type: "GET",
        dataType: "json",
        success: function (respose) {
            if (respose.id != null) {
                idBuscado = respose.id;
                $("#nameUpdateCloud").val(respose.name);
                $("#brandUpdateCloud").val(respose.brand);
                $("#yearUpdateCloud").val(respose.year);
                $("#descriptionUpdateCloud").val(respose.description);
                $("#categoryUpdateCloud").val(respose.category.id);
            } else {
                alert("The record was not found!!");
            }
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}


$("#btnGuardarCategoria").click(function () {
    var name = $("#nameCategory").val();
    var description = $("#descriptionCategory").val();
    var data = {
        name: name,
        description: description
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

                $("#nameCategory").val("");
                $("#descriptionCategory").val("");
                cargarCategory();
            },
            500: function () {
                alert("An error has occurred!!");
            }
        }
    });
});



$(document).ready(function () {
    consultarCloud();
    cargarCategory();

});