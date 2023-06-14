var idBuscado = 0;


function cleanReservation() {
    $("#startDate").val("");
    $("#devolutionDate").val("");
    $("#cloud").val(0);
    $("#client").val(0);
}

function consultarReservation() {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Reservation/all",
        type: "GET",
        dataType: "json",
        success: function (respose) {
            $("#contenidoTablaReservation").empty();
            respose.forEach(element => {
                var row = $("<tr>");
                row.append($("<td>").text(element.startDate));
                row.append($("<td>").text(element.devolutionDate));
                row.append($("<td>").text(element.cloud.name));
                row.append($("<td>").text(element.client.name));

                row.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-warning btn-block w-100" data-bs-target="#updateReservationModal" data-bs-toggle="modal" onclick="buscarReservation(' + element.idReservation + ')">Editar</button>'));
                row.append($("<td class='text-center'>").append('<button type="button" class="btn btn-outline-danger btn-block w-100" onclick="eliminarReservation(' + element.idReservation + ')">Eliminar</button>'));
                $("#contenidoTablaReservation").append(row);
            });
        },
        error: function (xhr, status) {
            alert("error!!");
        }
    });
}



function cargarCloud() {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Cloud/all",
        type: "GET",
        dataType: "json",
        success: function (respose) {

            $(".cloud").each(function () {
                $(this).empty();
                $(this).append($("<option>").val(0).text("Select a Cloud"));

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

function cargarClient() {
    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Client/all",
        type: "GET",
        dataType: "json",
        success: function (respose) {

            $(".client").each(function () {
                $(this).empty();
                $(this).append($("<option>").val(0).text("Select a Client"));

                respose.forEach(element => {
                    $(this).append($("<option>").val(element.idClient).text(element.name));
                });
            });
        },
        error: function (xhr, status) {
            alert("An error has occurred!!");
        }
    });
}


function crearReservation() {

    if($("#startDate").val().length == 0 || $("#devolutionDate").val().length == 0 ){
        alert("All fields are required")
    }else{ 
    var startDate = $("#startDate").val();
    var devolutionDate = $("#devolutionDate").val();
    var cloud_id = $("#cloud").val();
    var client_id = $("#client").val();

    var data = {
        startDate: startDate,
        devolutionDate: devolutionDate,
        cloud:{
            id: cloud_id
        },
        client:{
            idClient: client_id
        }
    };

    $.ajax({
        url: "https://desarrollonube.azurewebsites.net/api/Reservation/save",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function () {
                $("#startDate").val("");
                $("#devolutionDate").val("");
                $("#cloud").val(0);
                $("#client").val(0);
                alert("Successfully created!!");
                consultarReservation();
                
            },
            500: function () {
                alert("An error has occurred!!");
            }
        }
    });
}
}

function actualizarReservation(){
    var id = idBuscado;
    var startDate = $("#startDateUpdate").val();
    var devolutionDate = $("#devolutionDateUpdate").val();
    var cloud_id = $("#cloudUpdateReservation").val();
    var client_id = $("#clientUpdateReservation").val();
    

    var data = {
        idReservation: id,
        startDate: startDate,
        devolutionDate: devolutionDate,
        cloud: {
            id: cloud_id
        },
        client: {
            idClient: client_id
        }
    };
    $.ajax({
        url:"https://desarrollonube.azurewebsites.net/api/Reservation/update",
        type:"PUT",
        dataType:"json",
        data:JSON.stringify(data), 
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function(){
                idBuscado = 0;
                $("#startDate").val("");
                $("#devolutionDate").val("");
                $("#cloud").val(0);
                $("#client").val(0);
                consultarReservation();
            }
        }
    });
}


function eliminarReservation(id){
    var r = confirm("Are you sure to delete the reservation?");
    if (r == true) {
        var data = {
            idReservation:id
        };
      
        $.ajax({
            url:"https://desarrollonube.azurewebsites.net/api/Reservation/"+id,
            type:"DELETE",
            dataType:"json",
            data:JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                204: function(){
                  
                    consultarReservation();
                }
            }
        });
    }
}



function buscarReservation(id){
    $.ajax({
        url:"https://desarrollonube.azurewebsites.net/api/Reservation/"+id,
        type:"GET",
        dataType:"json",
        success: function (respose){
            if(respose.idReservation!=null){
                idBuscado = respose.idReservation;
                $("#startDate").val(respose.startDate);
                $("#devolutionDate").val(respose.devolutionDate);
                $("#cloudUpdateReservation").val(respose.cloud.id);
                $("#clientUpdateReservation").val(respose.client.idClient);
            }else{
                alert("The record was not found!!");
            }
        },
        error: function(xhr,status){
            alert("An error has occurred!!");
        }
    });
}




$("#btnGuardarCloud").click(function(){
    var name = $("#nameCloud").val();
    var brand = $("#brandCloud").val();
    var year = $("#yearCloud").val();
    var description = $("#descriptionCloud").val();
    var data = {
        name:name,
        brand: brand,
        year:year,
        description:description
    };
    $.ajax({
        url:"https://desarrollonube.azurewebsites.net/api/Cloud/save",
        type:"POST",
        dataType:"json",
        data:JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function(){
                
                $("#nameCloud").val("");
                $("#brandCloud").val("");
                $("#yearCloud").val("");
                $("#descriptionCloud").val("");
                cargarCloud();
            },
            500: function(){
                alert("An error has occurred!!");
            }
        }
    });
});



$("#btnGuardarClient").click(function(){
    var email = $("#emailClient").val();
    var password = $("#passwordClient").val();
    var name = $("#nameClient").val();
    var age = $("#ageClient").val();
    
    var data = {
        email:email,
        password:password,
        name:name,
        age:age
    };
    $.ajax({
        url:"https://desarrollonube.azurewebsites.net/api/Client/save",
        type:"POST",
        dataType:"json",
        data:JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function(){
                
                $("#emailClient").val("");
                $("#passwordClient").val("");
                $("#nameClient").val("");
                $("#ageClient").val("");
                cargarClient();
            },
            500: function(){
                alert("An error has occurred!!");
            }
        }
    });
});

$(document).ready(function(){
   
    consultarReservation();
    cargarCloud();
    cargarClient();
});