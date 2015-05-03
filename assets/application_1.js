var Json;
var Snippets;
var Labels;
var LabelRel;
var Files;
var Groups;
var Members;
var LabelRelSnipWise;
var LabelRelLabelWise;
var UserDetail;
var TotalNoOfSnips;

var selectedSnip=null;
var selectedGroup=null;
var selectedlabel=null;
var selectedSnipVersion=null;

var searchType="0";
var searchLan="all";
var searchName="";
var searchLabel={};

var application = {};
var addMemberToNewGroup={};
var snipLabelForCreateSnip={};
var snipLabelForUpdateSnip={};
var copySnipToGroup={};
var login_user_id;
var publicGroup;

var perone="Viewer";
var perthree="Programmer";
var perseven="Manager";

var editorUpdate = ace.edit("editor2");        
 editorUpdate.getSession().setMode("ace/mode/javascript");

var editorView = ace.edit("editor");    
editorView.setReadOnly(true);
editorView.getSession().setMode("ace/mode/javascript");

 var editorAdd = ace.edit("editor3");        
editorAdd.getSession().setMode("ace/mode/javascript");

application.config = {
    getTimeZone : function(){
        var timeZone = jstz.determine();
        return timeZone.name(); 
    },
    getBasePath : function(){
        return "http://codedrive.com/";
    }
    
}

application.data = {
    getFressData: function(groupId) {
        var timezone=application.config.getTimeZone();
        var perameters=null;
        var url=null;
        if (typeof groupId === "undefined" || groupId === null) {   //            application.data.getFressData("125");
            url=application.config.getBasePath()+"appcontroller/getUserPrivateData";
            perameters={timeZone:timezone};
        }
        else{
            //alert(Groups[groupId]);
            if(typeof Groups[groupId] === "undefined")
            {  // false
                application.data.setScelectedGroupAsPrivate();
                url=application.config.getBasePath()+"appcontroller/getUserPrivateData";
                perameters={timeZone:timezone};
            }
            else
            { // true
                if(Groups[groupId]["project_group_type"]=="3")
                {
                    url=application.config.getBasePath()+"appcontroller/getUserGroupData";
                    var id=Groups[groupId]["project_group_id"];
                    perameters={timeZone:timezone,groupId:id};
                }
                else if(Groups[groupId]["project_group_type"]=="2")
                {
                    url=application.config.getBasePath()+"appcontroller/getUserPrivateData";
                    perameters={timeZone:timezone};
                }

            }
        }         
            $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
               // alert(data);
                 res=jQuery.parseJSON( data );
                 if(res.status=="1"){
                    // $.notify("Welcome to CodeDrive");
                     Json=res.data;
                     return true;
                 }
                 else{
                     $.notify(res.error, "error");
                     return false;
                 }
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
            });
    },
    setData : function(){
        Snippets=Json["snippet"];       
        Labels=Json["label"];
        LabelRel=Json["labelrel"];
        Files=Json["file"];
        Groups=Json["group"];
        UserDetail=Json["user"];
        if(Json["member"])
        {
             Members=Json["member"];
        }
        else{
            Members=null;
        }
        $("#userName").text(UserDetail.user_name);
        application.data.labelrel.setLabelRels();
    },
    resetSearchVariables : function(){
         $(".label-list-container li").removeClass('selected-label');
        $("#search-snip-name").val("");
        $("#snipLanSearch").selectpicker('val', "all");
        searchType="0";
        searchLan="all";
        searchName="";
        searchLabel={};
    },
    setUPsnipeets : function(check){
         $(".snippet-list-container").empty();
        allSnip=Snippets;
        if(!jQuery.isEmptyObject(allSnip)){ 
            if(searchLabel!="no"){
                if(!jQuery.isEmptyObject(searchLabel)){   // check for selected labels
                   // alert("inlabels");
                    if(!LabelRelLabelWise.hasOwnProperty(searchLabel.label_id))
                    {
                         application.data.snippet.setDefaultDetailofSnippetViewDiv();
                        return 0;
                    }
                    else if(!LabelRelLabelWise[searchLabel.label_id].hasOwnProperty(searchLabel.label_creaed_device_id))
                    {
                         application.data.snippet.setDefaultDetailofSnippetViewDiv();
                        return 0;
                    }
                    else{ 
                       allSnip={};
                       labelSnip=LabelRelLabelWise[searchLabel.label_id][searchLabel.label_creaed_device_id];
                       for(var i = 0; i < labelSnip.length; i++) {
                            var obj = labelSnip[i];
                            allSnip[obj.snippet_id]={};allSnip[obj.snippet_id][obj.snippet_created_device_id]={};
                            allSnip[obj.snippet_id][obj.snippet_created_device_id]=Snippets[obj.snippet_id][obj.snippet_created_device_id];
                        }
                    }
                }
            }
            else{
                allSnip={};
                $.each(Snippets , function(i, object) {  
                    $.each(object, function(property, value) {
                            if(LabelRelSnipWise.hasOwnProperty(i) && LabelRelSnipWise[i].hasOwnProperty(property))
                            {
                                return 0;
                            }
                            else{     
                                    allSnip[i]={};allSnip[i][property]={};
                                    allSnip[i][property]=Snippets[i][property];
                            }
                    });
                 });
            }
            //alert(JSON.stringify(allSnip));
            $.each( allSnip , function(i, object) {  
                 $.each(object, function(property, value) {
                     if(searchLan!="all"){   // check snippet language
                        // alert("inlang");
                         if(Snippets[i][property].snippet_code_lan!=searchLan){
                             return true;
                         }
                     }
                     if(searchName!=""){   // check snip name
                      //   alert("inname");
                         var name=Snippets[i][property].snippet_name;
                         if(name.toLowerCase().indexOf(searchName.toLowerCase())==-1){
                             return true;
                         }
                     }
                     if(searchType=="0" || searchType=="1"){   // 0=all 1=public 2=private
                         if(Snippets[i][property].project_group_id==UserDetail.public_group_id){
                                application.data.snippet.addPublicSnippetToList(i,property);
                                return true;
                         }
                     }
                     if(searchType=="0" || searchType=="2"){
                         if(Snippets[i][property].project_group_id!=UserDetail.public_group_id){
                            application.data.snippet.addSnippetToList(i,property);
                            return true;
                         }
                     }

                 });
             });
        }
         if(check!=true || check=="undefined" ){
                 application.data.snippet.setDefaultSnipSelected();
         }else{
             if(!jQuery.isEmptyObject(selectedSnip)){
                  $(".snippet-list-container a[data-snippetid="+selectedSnip.snippet_id+"][data-scdid="+selectedSnip.snippet_created_device_id+"]").trigger("click");
             }
            
         }
    },
    setUPAllsnipeets : function(){
         $(".snippet-list-container").empty();
         $.each( Snippets , function(i, object) {
             $.each(object, function(property, value) {  
                 if(Snippets[i][property].project_group_id==UserDetail.public_group_id){
                      application.data.snippet.addPublicSnippetToList(i,property);
                 }else{
                     application.data.snippet.addSnippetToList(i,property);
                 }                    
             });
         });
                 application.data.snippet.setDefaultSnipSelected();
    },
    setUPPublicsnipeets : function(){
        $(".snippet-list-container").empty();
         $.each( Snippets , function(i, object) {
             $.each(object, function(property, value) {  
                 if(Snippets[i][property].project_group_id==UserDetail.public_group_id){
                      application.data.snippet.addPublicSnippetToList(i,property);
                 }                    
             });
         });
         application.data.snippet.setDefaultSnipSelected();
    },
    setUPPrivatesnipeets : function(){
        $(".snippet-list-container").empty();
         $.each( Snippets , function(i, object) {
             $.each(object, function(property, value) {  
                 if(Snippets[i][property].project_group_id!=UserDetail.public_group_id){
                     application.data.snippet.addSnippetToList(i,property);
                 }                 
             });
         });
          application.data.snippet.setDefaultSnipSelected();
    },
    setUPlebels : function(){
         $.each( Labels , function(i, object) {
             $.each(object, function(property, value) {
                    application.data.label.addLabelToList(i,property);
             });
         });
          var html='<li id="labelItem" data-id="no" data-lcdid="no">'+
	'<a href="#">'+
		'<span class="labelSearchSnip"><span class="label-color" style="border: 1px solid #da1d00;background: transparent;"></span><span class="sidebar-label-name">No Label</span></span><span class="badge pull-right" style="min-width: 28;">'+application.data.labelrel.getTotalSnipWithNoLabel()+'</span>'+
            '</a>'+
        '</li>';
        $(".label-list-container").prepend(html);
    },
    setUPfiles : function(){
         $.each( Files , function(i, object) {
             $.each(object, function(property, value) {
                    application.data.file.addFileToList(i,property);
             });
         });
    },
    setUpGroup : function(){
      //  alert("in group ");
        application.data.group.addGroupsToList();
      },
    setUpGui : function(){
        $(".snippet-list-container").empty();
        $(".label-list-container").empty();
        $(".file-list-container").empty();
        $(".group-dropdown").empty(); 
       
        var datajson=null;
        if(selectedGroup==null)
        {
            datajson=this.getFressData();
        }
        else
        {
           datajson=this.getFressData(selectedGroup["project_group_id"]); 
        }
        if(datajson==false){
            return;
        }
        this.setData();
        if(selectedGroup==null)
        {
            this.setScelectedGroupAsPrivate();
        }else{
            selectedGroup=Groups[selectedGroup["project_group_id"]];
        }
        application.data.resetSearchVariables();
        $("#view-all-codes").addClass('selected-label');
        if(Snippets!=null){
            this.setUPsnipeets();
        }
        if(Labels!=null){
            this.setUPlebels();
        }        
        if(Files!=null){
             this.setUPfiles();
        }       
        if(Groups!=null){
             this.setUpGroup();
        }
        application.data.setUpView(selectedGroup["project_group_id"]);
        application.data.snippet.setTotalNoOfSnips();
        if(selectedGroup["project_group_type"]=="3"){
            $("#groupnameDroupdown").text(selectedGroup.project_group_name);
            if(selectedGroup["project_group_member_privilage_index"]=="1"){
                $("#permissionName").text("Viewer");               
            }
            else if(selectedGroup["project_group_member_privilage_index"]=="3"){
                 $("#permissionName").text("Programmer");
            }
            else if(selectedGroup["project_group_member_privilage_index"]=="7"){
                 $("#permissionName").text("Manager");
                 if(selectedGroup.project_group_created_user_id==UserDetail.user_id){                    
                     $("#permissionName").text("administrator");
                }
            }
        }
      },
    setScelectedGroupAsPrivate :function(){
           $.each( Groups , function(i, object) {
            if(object["project_group_type"]=="2"){
                selectedGroup=object;
                return;
            }
         }); 
    },
    setUpGuiForPersnolView: function(){
        $("#snip-type-btn-group").show();
        $("#private-group-detail").hide();
        $("#addLabelPopover").show();
          $(".label-list-container").find("li #editLabelPopover").show();
           $("#update-selected-snip").show();
          $("#delete-selected-snip").show();
           $("#create-snip").show();
           $("#naw-file-add").show();
           $("#delete-file-popover").show();
           $("#restore-btn").show();
           $("#update-snip-label-rel").show();
    },
    setUpGuiForGroupView: function(){
         $("#snip-type-btn-group").hide();
         $("#private-group-detail").show();
         $("#addLabelPopover").hide();
          $(".label-list-container").find("li #editLabelPopover").hide();
          $("#groupModalDelete").hide();$("#groupUpdateModel").hide();
          $("#groupModalLeave").show();
          $("#update-selected-snip").hide();
          $("#delete-selected-snip").hide();
          $("#create-snip").hide();
           $("#naw-file-add").hide();
           $("#restore-btn").hide();
           $("#update-snip-label-rel").hide();
            $(".file-list-container").find("li #delete-file-popover").hide();
            var validate=application.data.group.check_permission(3);
            if(validate==true){
                $("#addLabelPopover").show();
                $(".label-list-container").find("li #editLabelPopover").show();
                $("#update-selected-snip").show();
                $("#delete-selected-snip").show();
                $("#create-snip").show();
                 $("#naw-file-add").show();
                  $(".file-list-container").find("li #delete-file-popover").show();
                   $("#restore-btn").show();
                    $("#update-snip-label-rel").show();
            }
            validate=application.data.group.check_permission(7);
            if(validate==true){
              $("#groupUpdateModel").show();
            }
            if(selectedGroup.project_group_created_user_id==UserDetail.user_id){
                $("#groupModalDelete").show();
            }
    },
    setUpView : function(groupId){
        if (typeof groupId === "undefined" || groupId === null) {   //            application.data.getFressData("125");
            application.data.setUpGuiForPersnolView();
        }
        else{
            if(typeof Groups[groupId] === "undefined")
            {  
               application.data.setUpGuiForPersnolView();
            }
            else
            { // true
                if(Groups[groupId]["project_group_type"]=="3" && groupId!=UserDetail.group_id && groupId!=UserDetail.public_group_id)
                {
                    application.data.setUpGuiForGroupView();
                }
                else if(Groups[groupId]["project_group_type"]=="2" && groupId==UserDetail.group_id && groupId!=UserDetail.public_group_id)
                {
                   application.data.setUpGuiForPersnolView();
                }

            }
        } 
    }
    
}

application.data.snippet = {
    addSnippetToList : function(sid,scdid){
        var snip=Snippets[sid][scdid];  //<span id="label" class="snippet-label label-color-1">Important</span>
        var labshtml=application.data.labelrel.getLabelsOfSnipHtml(sid,scdid);
        var lock="";
//        if(labshtml.)
        var sniphtml='<a href="#" class="list-group-item snippet-list-item" data-snippetid='+snip["snippet_id"]+' data-scdid='+snip["snippet_created_device_id"]+' >'+
	'<div>'+ 
		'<div class="list-group-item-heading">'+
			'<div class="row">'+
				'<div class="col-xs-10 col-md-10">'+
					'<div class="code-name">'+snip["snippet_name"]+'</div>'+
					'<span class="code-created">Created at '+snip["snippet_created_time"]+'</span>'+
				'</div>'+
				'<div class="col-xs-2 col-md-2">'+
						'<span class="glyphicon glyphicon-lock glyph-width pull-right"></span>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="list-group-item-text code-description">'+snip["snippet_desc"]+'</div>'+
		'<div class="code-label">'+
			'<span class="glyphicon glyphicon-tags glyph-width">'+'</span>'+'Labels '+labshtml+
                            '</div>'+
                    '</div>'+
            '</a>';
        $(".snippet-list-container").prepend(sniphtml);
    },
    addPublicSnippetToList : function(sid,scdid){
        var snip=Snippets[sid][scdid];  //<span id="label" class="snippet-label label-color-1">Important</span>
        var labshtml=application.data.labelrel.getLabelsOfSnipHtml(sid,scdid);
        var lock="";
//        if(labshtml.)
        var sniphtml='<a href="#" class="list-group-item snippet-list-item" data-snippetid='+snip["snippet_id"]+' data-scdid='+snip["snippet_created_device_id"]+' >'+
	'<div>'+ 
		'<div class="list-group-item-heading">'+
			'<div class="row">'+
				'<div class="col-xs-10 col-md-10">'+
					'<div class="code-name">'+snip["snippet_name"]+'</div>'+
					'<span class="code-created">Created at '+snip["snippet_created_time"]+'</span>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="list-group-item-text code-description">'+snip["snippet_desc"]+'</div>'+
		'<div class="code-label">'+
			'<span class="glyphicon glyphicon-tags glyph-width">'+'</span>'+'Labels '+labshtml+
                            '</div>'+
                    '</div>'+
            '</a>';
        $(".snippet-list-container").prepend(sniphtml);
    },
    addSnippet : function(){
            var validate=application.data.group.check_permission(3);
            if(validate==false){
                $('#createModal').modal('hide');
                $.notify("Access denied.", "error");
                return;
            }
            $("#AddSnipDangeralert ul").empty();
            $("#AddSnipDangeralert").hide();
            if(selectedGroup["project_group_type"]=="2"){
                $('#snip-groupId').attr("value","");
                 if($("#public-private-view").is(':checked')){
                     $('#public-private').prop('checked', true);
                 }
                 else{
                     $('#public-private').prop('checked', false);
                 }
            }
            else{
                $('#public-private').prop('checked', false);
                $('#snip-groupId').attr("value",selectedGroup["project_group_id"]);
            }
            $("#snipCode").val(editorAdd.getValue());
            var url=application.config.getBasePath()+"snippetcontroller/create_snippet";
            var perameters=$("#add-snip-form").serializeArray();
            if(!jQuery.isEmptyObject( snipLabelForCreateSnip )){
                perameters.push({ name: "labels", value: JSON.stringify(snipLabelForCreateSnip) });
            }else{
                perameters.push({ name: "labels", value:"0" });
            }
            $("#snip-add-loading").fadeIn();
            $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
                 var res=jQuery.parseJSON( data );
                  if(res["status"]=="0"){
                       $("#AddSnipDangeralert").show();
                      $("#AddSnipDangeralert ul").append(res["error"]);
                       //$.notify("Cannot created snippet, something wrong with server", "error");
                  }
                  else{
                      $('#createModal').modal('hide');
                      $.notify("Snippet created successfully");
                      application.data.snippet.refressSnippet(false);
                  }
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
            }).always(function(){
                $("#snip-add-loading").fadeOut();
            });
    },
    resetAddSnipForm : function(){
        snipLabelForCreateSnip={};
         $("#add-snip-label-container").empty();
        $("#add-snip-form").get(0).reset();
        $('#public-private-view').bootstrapSwitch('state', false);
        editorAdd.setValue("");
         if(selectedGroup["project_group_type"]=="3"){
             $("#addSnippet-public").hide();
         }else{
              $("#addSnippet-public").show();
         }
    },
    snippetSelected : function(snipId,scdid){
         if(Snippets.hasOwnProperty(snipId) && Snippets[snipId].hasOwnProperty(scdid))
            {
                if(Snippets[snipId][scdid].snippet_code!=null){
                    this.setSelectedSnip(snipId,scdid);
                    return;
                }
                else{
                    var peram=Snippets[snipId][scdid];
                    $.post( application.config.getBasePath()+"snippetcontroller/get_snippet",peram,function( data ) {
                        var res=jQuery.parseJSON( data );
                        if(res.status==1){
                            Snippets[snipId][scdid].snippet_code=res.data.snippet_code;
                            application.data.snippet.setSelectedSnip(snipId,scdid);
                            return;
                        }
                        else{                            
                            $.notify(res.error, "error");
                            return;
                        }
                  });
                }
            }
            else $.notify("Something wrong with data, please refresh your page.", "error");
    },
    setSelectedSnip : function(snipId,scdid)
    {
        $("#snippet-details").show();
        $("#snippet-details-edit").hide();
         $(".snippet-version-containor").hide();
        var labshtml=application.data.labelrel.getLabelsOfSnipHtml(snipId, scdid);
        copySnipToGroup={};
        snipLabelForUpdateSnip={};
        selectedSnip=Snippets[snipId][scdid];
        $(".label-container").html(labshtml);
        $("#selected-snip-title").html("<span>Snippet Title -  </span><span style='font-weight:normal;'>"+selectedSnip.snippet_name+"</span>");
        $("#selected-snip-desc").html("<span>Snippet Description -  </span>"+selectedSnip.snippet_desc);
        if(selectedGroup.project_group_id== UserDetail.group_id){
             $("#selected-snip-detail").html("Created on "+selectedSnip.snippet_created_time+" and Last updated on "+selectedSnip.snippet_updated_time);
        }else{
            var created="unknown(deleted member)";
            var updated="unknown(deleted member)"; 
            $.each(Members, function(i, object) {                
               if(selectedSnip.snippet_created_user_id==i){
                   created=object.user_name;
               }
               if(selectedSnip.snippet_updated_user_id==i){
                   updated=object.user_name;
               }
            });
            $("#selected-snip-detail").html("Created on "+selectedSnip.snippet_created_time+" and Last updated on "+selectedSnip.snippet_updated_time+" </br> Created by "+created+" &nbsp;&nbsp; Last updated by "+updated);
        }       
       $("#selected-snip-lan").html("Language: "+selectedSnip.snippet_code_lan);
       $("#selected-snip-var").html("Version: "+selectedSnip.snippet_version_no);
       editorView.getSession().setMode("ace/mode/"+selectedSnip.snippet_code_lan);
        editorView.setValue(selectedSnip.snippet_code);
        
    },
    deleteSelectedSnip : function(){
        //alert(JSON.stringify(Snippets));
        var validate=application.data.group.check_permission(3);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
        var peram=selectedSnip;
        $.post( application.config.getBasePath()+"snippetcontroller/delete_snippet",peram,function( data ) {
            var res=jQuery.parseJSON( data );
            //alert(data);
            if(res.status==1){
                delete Snippets[selectedSnip.snippet_id][selectedSnip.snippet_created_device_id];
                // alert(JSON.stringify(Snippets));
                $.notify("Snippet deleted Successfully");
                $(".snippet-list-container").empty();
                 $.each(LabelRel , function(i, object) {
                     $.each(object, function(property, value) {
                            if(value.snippet_id==selectedSnip.snippet_id && value.snippet_created_device_id==selectedSnip.snippet_created_device_id){
                                delete LabelRel[i][property];
                            }
                     });
                 });
                 $(".label-list-container").empty();
                 application.data.labelrel.setLabelRels();
                 application.data.setUPlebels();
                application.data.setUPsnipeets();
                application.data.snippet.setDefaultSnipSelected();
                application.data.snippet.setTotalNoOfSnips();
                return true;
            }
            else{
                $.notify(res.error, "error");
                return;
            }
      });
    },
    setDataForUpdate : function(){
        var validate=application.data.group.check_permission(3);
            if(validate==false){
                $('#createModal').modal('hide');
                $.notify("Access denied.", "error");
                return;
            }
        var snip=selectedSnip;
        $("#code-title").html(snip.snippet_name);
        $("#snip-name-update").val(snip.snippet_name);
        $("#snip-lan-update").selectpicker('val', snip.snippet_code_lan);
        $("#snip-desc-update").val(snip.snippet_desc);
        editorUpdate.getSession().setMode("ace/mode/"+snip.snippet_code_lan);
        editorUpdate.setValue(snip.snippet_code);
        
    },
    updateSnippet : function(){
        var validate=application.data.group.check_permission(3);
            if(validate==false){
                $("#cancel-edit").trigger( "click" );
                $.notify("Access denied.", "error");
                return;
            }
        var snip=selectedSnip;
        snip.snippet_name=$("#snip-name-update").val();
        snip.snippet_code_lan=$("#snip-lan-update").val();
        snip.snippet_desc=$("#snip-desc-update").val();
        snip.snippet_code=editorUpdate.getValue();
        
        if(snip.snippet_name.length==0){
            $.notify("Snippet name is required",{ className: "error"});
            return;
        }
        if(snip.snippet_code.length==0){
            $.notify("Please write your code",{ className: "error"});
            return;
        }
        if(snip.snippet_desc.length==0){
            $.notify("Snippet description is required",{ className: "error"});
            return;
        }         
        if(snip.snippet_name.length>30){
            $.notify("Snippet name length cannot be more then 30 characters",{ className: "error"});
            return;
        }
        if(snip.snippet_desc.length>100){
            $.notify("Snippet name length cannot be more then 100 characters",{ className: "error"});
            return;
        }
        $.post( application.config.getBasePath()+"snippetcontroller/update_snippet",snip,function( data ) {
                  var res=jQuery.parseJSON( data );
                 //alert(data);
                 if(res.status==0){
                     $.notify(res.error,{ className: "error"});
                 }
                 else{
                     $.notify("Snippet Updated Successfully");
                     application.data.snippet.refressSnippet(true);
//                     alert($(".snippet-list-container a[data-snippetid="+snip.snippet_id+"][data-scdid="+snip.snippet_created_device_id+"]" ).attr("data-snippetid"));
                     $(".snippet-list-container a[data-snippetid="+snip.snippet_id+"][data-scdid="+snip.snippet_created_device_id+"]" ).trigger( "click" );
                       $("#cancel-edit").trigger( "click" );
                 }
           });
    },
    setDefaultSnipSelected : function(){
        if($(".snippet-list-container a").length!=0){
            $("#snippet-details").find("*").prop("disabled",false);
            $(".snippet-list-container a:first-child" ).trigger( "click" );
        }else{
           application.data.snippet.setDefaultDetailofSnippetViewDiv();
        }        
    },
    setDefaultDetailofSnippetViewDiv : function(){
        //  alert("ddd");
            $("#selected-snip-title").html("No snippet selected");
            $("#selected-snip-detail").html("&nbsp;");
            $("#selected-snip-lan").html("&nbsp;");
       $("#selected-snip-var").html("&nbsp;");
            editorView.setValue("");
            $("#selected-snip-desc").html("");
            $("#label-container").html("");
            $("#snippet-details").find("*").prop("disabled",true);
			$("#snippet-label-container").empty();
    },
    getFressSnippets :function(){
        var validate=application.data.group.check_permission(1);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
         var timezone=application.config.getTimeZone();
        var perameters=null;
        var url=null;  //selectedGroup["project_group_type"]=="2"
        if (typeof selectedGroup === "undefined" || selectedGroup === null) {   //            application.data.getFressData("125");
           url=application.config.getBasePath()+"snippetcontroller/getUserPrivateData";
            perameters={timeZone:timezone};
        }
        else{
            //alert(Groups[groupId]);
            if(typeof Groups[selectedGroup.project_group_id] === "undefined")
            {  // false
                url=application.config.getBasePath()+"snippetcontroller/getUserPrivateData";
                perameters={timeZone:timezone};
            }
            else
            { // true
                if(Groups[selectedGroup.project_group_id]["project_group_type"]=="3")
                {
                    url=application.config.getBasePath()+"snippetcontroller/getUserGroupData";
                    var id=Groups[selectedGroup.project_group_id]["project_group_id"];
                    perameters={timeZone:timezone,groupId:id};
                }
                else if(Groups[selectedGroup.project_group_id]["project_group_type"]=="2")
                {
                    url=application.config.getBasePath()+"snippetcontroller/getUserPrivateData";
                    perameters={timeZone:timezone};
                }

            }
        }         
            $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
                //alert(data);
                 res=jQuery.parseJSON( data );
                 if(res.status=="1"){
                     //$.notify("Welcome to odedrive");
                     responceData=res.data;
                     Snippets=responceData["snippet"];
                     LabelRel=responceData["labelrel"];
                     application.data.labelrel.setLabelRels();
                     $(".label-list-container").empty();
                     application.data.setUPlebels();
                     return true;
                 }
                 else{
                    $.notify(res.error, "error");
                    return false;
                 }
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });
    },
    refressSnippet : function(check){
        $(".snippet-list-container").empty();
        var datajson=null;
        datajson=this.getFressSnippets();
        if(datajson==false){
            $.notify("Cannot ritrive data from databse", "error")
            return;
        }
        application.data.snippet.setTotalNoOfSnips();
        application.data.setUPsnipeets(true);
        if(check!=true){
            application.data.snippet.setDefaultSnipSelected();
        }
        
    },
    copySnipTOGroupHtml : function(){
         var lab="";
         var name;
         if(!jQuery.isEmptyObject( Groups )){
            $.each( Groups , function(i, value) {     
                if(value.project_group_member_privilage_index>=3){
                    if(value.project_group_type!=2){
                        name=value["project_group_name"];
                    }else{
                        name="Personal Library";
                    }
                    if(lab==""){
                        lab='<li>'+
                                    '<span><input type="checkbox" id="groupcheckboxadd" data-labid="'+value['project_group_id']+'" name="select-group"></span>'+
                                    '<span class="group-name"> '+name+'</span>'+
                            '</li>';
                    }else{
                        lab+='<li>'+
                                    '<span><input type="checkbox" id="groupcheckboxadd" data-labid="'+value['project_group_id']+'" name="select-group"></span>'+
                                    '<span class="group-name"> '+name+'</span>'+
                            '</li>';
                    }
                    copySnipToGroup[value['project_group_id']]={checked:"0"};
                }
            });
        }
        var html='<div>'+
                        '<div class="pick-groups-container" id="pick-groups-container-scroll">'+
                                '<ul class="pick-groups">'+lab+
                                '</ul>'+
                        '</div>'+                 
                '</div>';
            return html;        
    },
    copySnipChecked : function(gid,status){//add-snip-label-container
       var item;
       if(!Groups.hasOwnProperty(gid)){
            $.notify("data inconsistent", "error");
            item=0;
        }else{
            item= Groups[gid];
        }
       if(item!=0){
          if(status==1){
              copySnipToGroup[gid].checked="1";
              return 1;
          }else{
             copySnipToGroup[gid].checked="0";
              return 1;
          }
          
       }else{
           $.notify("Group not found", "error");
           return 0;
       }
    },
    copySnipToGroup : function(){
            var send=false;
            if(jQuery.isEmptyObject(copySnipToGroup)){
                     return;
               }
               $.each(copySnipToGroup, function(i,value) {
                    if(value["checked"]!="0"){
                        send=true;
                        return 0;
                    }
            });
            if(send==true){
                var perameters={};
                var url=application.config.getBasePath()+"snippetcontroller/copySnipToGroup";
                perameters["snippet"]=selectedSnip;
                if(!jQuery.isEmptyObject( copySnipToGroup)){
                     perameters["groups"]=copySnipToGroup;
                }else{
                    perameters["groups"]=0;
                }
                $.ajax({
                      type: 'POST',
                      url: url,
                      data: perameters,
                      async:false
                    }).done(function( data ) {
                        //alert(data);
                        copySnipToGroup={};
                         res=jQuery.parseJSON( data );
                         if(res.status=="1"){
                             $.notify(res.data);
                             return true;
                         }
                         else{
                             $.notify(res.error, "error");
                             return false;
                         }
                      }).fail(function() {
                       $.notify("Cannot connect to server", "error");
                    });
            }
        },
        loadVersions:function(){
            selectedSnipVersion={};
            var validate=application.data.group.check_permission(1);
            if(validate==false){
                $.notify("Access denied.", "error");
                return;
            }
            var snip=selectedSnip;
            if(snip.snippet_version_no=="1"){
                 $.notify("No older versions", "error");
                return;
            }
            var perameters=snip;
            var url=application.config.getBasePath()+"snippetcontroller/getVersionsOfSnip";
            $.ajax({
                  type: 'POST',
                  url: url,
                  data: perameters,
                  async:false
                }).done(function( data ) {                  
                     res=jQuery.parseJSON( data );
                     if(res.status=="1"){
                         selectedSnipVersion=res.data;
                       //  editorView.setValue(JSON.stringify(res.data));
                       application.data.snippet.setUpGuiForVersionView();
                         return true;
                     }
                     else{
                         $.notify(res.error, "error");
                         return false;
                     }
                  }).fail(function() {
                   $.notify("Cannot connect to server", "error");
                });
        },
        setUpGuiForVersionView :function(){
                var html="";
                    $.each(selectedSnipVersion , function(i, object) {
                        if(html==""){
                            html='<div class="snippet-version" data-version='+i+' data-lan='+object.snippet_code_lan+' >'+
                                        '<div class="col-xs-12 col-sm-12 col-md-12 row-bg" style="border-bottom: 1px solid #ddd;">'+
                                                '<div class="col-xs-10 col-sm-10 col-md-10" style="margin-top: 10px;">'+
                                                        '<div class="view-header-name" id="selected-snip-title">'+object.snippet_name+'</div>'+                                            
                                                '</div>'+
                                                '<div class="col-xs-2 col-sm-2 col-md-2" style="margin-top: 10px;">'+
                                                        '<button class="btn btn-default btn-sm pull-right" id="close-snip-ver" >Back</button>'+
                                                '</div>'+
                                                '<div class="col-xs-12 col-sm-12 col-md-12">'+
                                                        '<div class="view-header-created" id="selected-snip-detail" > Updated at '+object.snippet_updated_time+'</div>'+
                                                        '<div class="view-header-created pull-right" id="selected-version" >version : '+i+'</div>'+
                                                '</div>'+'<br />'+ '<br />'+'<br />'+
                                        '</div>'+                            
                                        '<div class="col-xs-12 col-sm-12-col-md-12" style="padding-left: 0; padding-right: 0;">'+
                                                '<div class="col-xs-12 col-sm-12-col-md-12 snippet-container-scrollbar" id="snippet-container-scroll" style="margin: 0; padding: 0;">'+
                                                                '<div class="snippet-file-code" id="file-code1">'+
                                                                        '<div id="version-editor-'+i+'" class="version-editor">'+object.snippet_code+'</div>'+
                                                                '</div>'+
                                                '</div>'+                                
                                        '</div>'+
                         '</div>';
                        }else{
                            html+='<div class="snippet-version" data-version='+i+' data-lan='+object.snippet_code_lan+' >'+
                                        '<div class="col-xs-12 col-sm-12 col-md-12 row-bg" style="border-bottom: 1px solid #ddd;">'+
                                                '<div class="col-xs-12 col-sm-12 col-md-12" style="margin-top: 10px;">'+
                                                        '<div class="view-header-name" id="selected-snip-title">'+object.snippet_name+'</div>'+
                                                '</div>'+
                                                '<div class="col-xs-12 col-sm-12 col-md-12">'+
                                                        '<div class="view-header-created" id="selected-snip-detail" > Updated at '+object.snippet_updated_time+'</div>'+
                                                        '<div class="view-header-created pull-right" id="selected-version" >version : '+i+'</div>'+
                                                '</div>'+'<br />'+ '<br />'+'<br />'+
                                        '</div>'+                            
                                        '<div class="col-xs-12 col-sm-12-col-md-12" style="padding-left: 0; padding-right: 0;">'+
                                                '<div class="col-xs-12 col-sm-12-col-md-12 snippet-container-scrollbar" id="snippet-container-scroll" style="margin: 0; padding: 0;">'+
                                                                '<div class="snippet-file-code" id="file-code1">'+
                                                                        '<div id="version-editor-'+i+'" class="version-editor">'+object.snippet_code+'</div>'+
                                                                '</div>'+
                                                '</div>'+                                
                                        '</div>'+
                         '</div>';
                        }
                     });
                     $(".snippet-version-containor").html(html);
                      $("#snippet-details").hide();
                     application.data.snippet.createEditorForVersionView();
                     
                      $(".snippet-version-containor").show();
        },
        createEditorForVersionView :function(){
            $('.snippet-version').each(function() { 
                var version=$(this).attr("data-version");               
                var versionEditor = ace.edit("version-editor-"+version); 
                var lan=$(this).attr("data-lan");    
                versionEditor.setReadOnly(true);
                versionEditor.getSession().setMode("ace/mode/"+lan);
            });
        },
        setTotalNoOfSnips : function(){
            var count=0;
                $.each( Snippets , function(i, object) {
                 $.each(object, function(property, value) {  
                     count++;                  
                 });
             });
             $("#totalnoofsnip").html(count);
        }
}

application.data.label = {
    addLabelToList : function(lid,lcdid){
        var lab=Labels[lid][lcdid];
        var html='<li id="labelItem" data-id='+lid+' data-lcdid='+lcdid+'>'+
	'<a href="#">'+
		'<span class="labelSearchSnip"><span class="label-color label-color-'+lab["label_color_id"]+'"></span><span class="sidebar-label-name">'+lab["label_name"]+'</span></span><span class="badge pull-right" style="min-width: 28;">'+application.data.labelrel.getLabelWiseTotalSnip(lid,lcdid)+'</span>'+
                '<span class="glyphicon glyphicon-edit glyph-width pull-right" id="editLabelPopover"  data-id='+lid+' data-lcdid='+lcdid+' data-original-title="Edit Label" title="Edit Label" ></span>'+
            '</a>'+
        '</li>';
        $(".label-list-container").prepend(html);
    },
    addNewLabel : function(name,col){
        var validate=application.data.group.check_permission(3);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
        var url,perameters;
        if(selectedGroup["project_group_type"]=="2"){
                 url=application.config.getBasePath()+"labelcontroller/addPrivateLabel";
                perameters={labelname:name,color:col};
            }
            else{
               url=application.config.getBasePath()+"labelcontroller/addGroupLabel";
               perameters={labelname:name,color:col,group:selectedGroup["project_group_id"]};       
            }
            $.post( url,perameters,function( data ) {
            var res=jQuery.parseJSON( data );
            if(res.status==1){
                $.notify(res.data);
                application.data.label.refressLabels();
            }
            else{
                $.notify(res.error, "error");
                return;
            }
      });
    },
    updateLabel : function(name,col,labelid,labelcdid){
        var validate=application.data.group.check_permission(3);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
        if(!Labels.hasOwnProperty(labelid) || !Labels[labelid].hasOwnProperty(labelcdid)){
            $.notify("data inconsistent", "error");
            return null;
        }
        var lab=Labels[labelid][labelcdid];
        lab.label_name=name;
        lab.label_color_id=col;
        $.post( application.config.getBasePath()+"labelcontroller/updateLabel",lab,function( data ) {
            var res=jQuery.parseJSON( data );
            if(res.status==1){
                $.notify(res.data);      
                application.data.label.refressLabels();
                application.data.setUPsnipeets(true);
            }
            else{
                $.notify(res.error, "error");                
            }            
         });
         return null;
    },
    deleteLabel : function(labelid,labelcdid){
        var validate=application.data.group.check_permission(3);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
        if(!Labels.hasOwnProperty(labelid) || !Labels[labelid].hasOwnProperty(labelcdid)){
            $.notify("data inconsistent", "error");
            return null;
        }
        var lab=Labels[labelid][labelcdid];
        $.post( application.config.getBasePath()+"labelcontroller/deleteLabel",lab,function( data ) {
            var res=jQuery.parseJSON( data );
            if(res.status==1){
                $.notify(res.data);       
                 delete Labels[labelid][labelcdid];
                 $.each(LabelRel , function(i, object) {
                     $.each(object, function(property, value) {
                            if(value.label_id==labelid && value.label_creaed_device_id==labelcdid){
                                delete LabelRel[i][property];
                            }
                     });
                 });
                 application.data.labelrel.setLabelRels();
                  $(".label-list-container").empty();
                 application.data.setUPlebels();
                 if(searchLabel.label_id==labelid && searchLabel.label_creaed_device_id==labelcdid){
                     searchLabel={};
                 }
                 application.data.setUPsnipeets(true);
            }
            else{
                $.notify(res.error, "error");                  
            }            
         });
         return null;
    },
    getLabel : function(labelid,labelcdid){
        if(!Labels.hasOwnProperty(labelid) || !Labels[labelid].hasOwnProperty(labelcdid)){
            $.notify("data inconsistent", "error");
            return 0;
        }else{
            return Labels[labelid][labelcdid];
        }
    },
    geneditpopover : function(labelid,labelcdid){
       var validate=application.data.group.check_permission(3);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
        if(!Labels.hasOwnProperty(labelid) || !Labels[labelid].hasOwnProperty(labelcdid)){
            $.notify("data inconsistent", "error");
            return null;
        }
         var lab=Labels[labelid][labelcdid];
         var colstring;
         for(var i=1;i<=16;i++){
             if(i==lab.label_color_id){
                 if(i==1){
                     colstring='<span id="label" data-id="'+i+'" class="label-color label-color-'+i+' label-color-selected">'+'</span>';
                 }
                 else{
                    colstring+='<span id="label" data-id="'+i+'" class="label-color label-color-'+i+' label-color-selected">'+'</span>'; 
                 }                
             }
             else{
                 if(i==1){
                      colstring='<span id="label" data-id="'+i+'" class="label-color label-color-'+i+'">'+'</span>';
                 }else{
                     colstring+='<span id="label" data-id="'+i+'" class="label-color label-color-'+i+'">'+'</span>';
                 }                 
             }
         }
         var addlabelhtml='<div>'+
		'<div class="input-group" id="add-label-name-div" style="border-bottom: 1px #111; padding-bottom: 10px;">'+
			'<label for="label_name_add" class="sr-only">Label Name</label>'+
			'<input type="text" id="label_name_update" value="'+lab.label_name+'"  name="label_name_add" class="form-control input-sm" placeholder="Label Name" maxlength="25" />'+
		'</div>'+
		'<div id="update-label-color-labels" class="label-colors-container">'+
			colstring+
		'</div>'+
		'<div>'+
			'<button type="button" id="update_label" data-id='+labelid+' data-lcdid='+labelcdid+' class="btn btn-primary btn-sm pull-right">Save</button>'+
			'<button type="button" class="btn btn-default btn-sm pull-right glyph-width" data-dismiss="popover-cancel" >Cancel</button>'+
                        '<button type="button" id="delete_label" data-id='+labelid+' data-lcdid='+labelcdid+' class="btn btn-default btn-sm pull-left"><span class="glyphicon glyphicon-trash glyph-width"></span></button>'+
		'</div>'+
	'</div>';
    return addlabelhtml;
    },
     getFressLabels :function(){
        var timezone=application.config.getTimeZone();
        var perameters=null;
        var url=null;  //selectedGroup["project_group_type"]=="2"
        if (typeof selectedGroup === "undefined" || selectedGroup === null) {   //            application.data.getFressData("125");
           url=application.config.getBasePath()+"labelcontroller/getUserPrivateData";
            perameters={timeZone:timezone};
        }
        else{
            //alert(Groups[groupId]);
            if(typeof Groups[selectedGroup.project_group_id] === "undefined")
            {  // false
                url=application.config.getBasePath()+"labelcontroller/getUserPrivateData";
                perameters={timeZone:timezone};
            }
            else
            { // true
                if(Groups[selectedGroup.project_group_id]["project_group_type"]=="3")
                {
                    url=application.config.getBasePath()+"labelcontroller/getUserGroupData";
                    var id=Groups[selectedGroup.project_group_id]["project_group_id"];
                    perameters={timeZone:timezone,groupId:id};
                }
                else if(Groups[selectedGroup.project_group_id]["project_group_type"]=="2")
                {
                    url=application.config.getBasePath()+"labelcontroller/getUserPrivateData";
                    perameters={timeZone:timezone};
                }

            }
        }         
            $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
               // alert(data);
                 res=jQuery.parseJSON( data );
                 if(res.status=="1"){
                   //  $.notify("sucess");
                     responceData=res.data;
                     Labels=responceData["label"];
                     LabelRel=responceData["labelrel"];
                     return true;
                 }
                 else{
                    $.notify(res.error, "error");
                    return false;
                 }
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });
    },
    refressLabels : function(){
        $(".label-list-container").empty();
        var datajson=null;
        datajson=this.getFressLabels();
        if(datajson==false){
            $.notify("Cannot ritrive data from databse", "error")
            return;
        }
        application.data.setUPlebels();
    }
}

application.data.group = {
    addGroupsToList : function(){
  //      alert("in group list");
        var grps=Groups;
        var divider="<li class='divider'></li>";
        var dividerlite="<li class='divider-lite'></li>";
        var privateHtml="";
        var groupHtml="";        
        var publicHtml='<li><a href="'+application.config.getBasePath()+'welcome/goPublic"><span class="glyphicon glyphicon-search glyph-width"></span><span id="groupnameDroupdown">Search Public</span></a></li>';    
        var createSnipHtml='<li><a href="#" data-toggle="modal" data-target="#groupModal"><span class="glyphicon glyphicon-plus glyph-width"></span><span id="groupnameDroupdown">New Group</a></span></li>';
         var count=0;
         $.each( grps , function(i, object) {
             if(object["project_group_member_request_status"]!=0){
          
                if(object["project_group_type"]=="2"){
                    privateHtml+='<li id="groupDropdownOption"  data-id='+object["project_group_id"]+' data-type='+object["project_group_type"]+'><a href="#"><span class="glyphicon glyphicon-folder-close glyph-width personal-lib"></span><span id="groupnameDroupdown">Personal Library</span></a></li>';
                }
                else if(object["project_group_type"]=="3"){
                    if(groupHtml!=""){
                        groupHtml+=dividerlite;
                    }
                    groupHtml+='<li id="groupDropdownOption" data-id='+object["project_group_id"]+' data-type='+object["project_group_type"]+'><a href="#"><span class="fa fa-users glyph-width"></span><span id="groupnameDroupdown">'+object["project_group_name"]+'</span></a></li>';
                }
             }
             else{
                 //chance class of group invites
                 count++;
             }
         });  
         if(count!=0){
             $("#req-number").html(count);
             $(".req-notification").show();
         }else{
             $(".req-notification").hide();
         }
         var finalHtml=privateHtml+divider+publicHtml+divider+"<div class='project-group-list nav nav-pills nav-stacked sidebar-scrollbar' style='max-height:200px;min-height:0px;'>"+groupHtml+"</div>"+divider+createSnipHtml;
         $(".group-dropdown").html(finalHtml);      
    },
    resetAddGroupform :function(){
        addMemberToNewGroup={};
       $('#group-name-add').val("");
       $('#group-desc-add').val("");
       $('#group-members-add').empty();
      var check= application.data.group.addOwnertoAddGroupForm();
      if(check==false){
         $("#groupModal").modal('hide');
      }
      addMemberToNewGroup[check]={};
      addMemberToNewGroup[check]["permission"]=7;
      application.data.group.updateTotalMembersInAddForm();
    },
   checkMemberForAddFrom : function(emailadd){ // sun function
       var url= url=application.config.getBasePath()+"groupcontroller/checkInvitedMember";
       var gro=selectedGroup;
        var perameters={email:emailadd,group:gro.project_group_id};
        var res;
        $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
              res=data
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });
            return res;      
   },
   checkValidEmail : function(emailadd){
        var url= url=application.config.getBasePath()+"groupcontroller/checkvalidEmail";
       var gro=selectedGroup;
        var perameters={email:emailadd};
        var res;
        $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
              res=data
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });
            if(res == "0"){
               return false;
           }
           else{
               return true;
           }    
   },
   addOwnertoAddGroupForm : function(){   // sub function
       var email=UserDetail.user_email;
       if(email==false){
           return false;
       }
       var html='<li id="member"><span class="glyphicon glyphicon-user "></span><div class="member-email">'+email+'</div><span class="member-owner">Owner</span></li>';
       $('#group-members-add').append(html);
       return email;
   },
   addMemberToAddGroupFrom :function(emailadd){  // main function
       if(addMemberToNewGroup.hasOwnProperty(emailadd)){
           $("#new-member-email-add").notify("This member is alredy added","error");
            return;
       }
         var check=application.data.group.checkValidEmail(emailadd);
         if(check == false){
            $("#new-member-email-add").notify("Not a valid email address","error");
            return;
         } 
         application.data.group.addMemberHtmlToAddGroupFrom(emailadd);
         addMemberToNewGroup[emailadd]={};
         addMemberToNewGroup[emailadd]["permission"]=1;
         //alert(JSON.stringify(addMemberToNewGroup));
         application.data.group.updateTotalMembersInAddForm();
         $("#new-member-email-add").val("");
   },
   addMemberHtmlToAddGroupFrom :function(email){  // sub function
       var html='<li id="member">'+
	'<span class="glyphicon glyphicon-user "></span>'+
	'<div class="member-email" id="member-email-add">'+email+'</div>'+
	'<div class="member-permission">'+
		'<select id="permission-member-add" class="form-control input-sm">'+
			'<option value="7" >'+perseven+'</option>'+
			'<option value="3" >'+perthree+'</option>'+
			'<option value="1" selected>'+perone+'</option>'+
	'</select>'+
	'</div>'+
	'<a class="member-remove" id="member-remove-add">Un-Invite</a>'+
    '</li>';
     $('#group-members-add').append(html);
   },
   updateTotalMembersInAddForm : function(){  // sub function
     var total=0;
     $.each( addMemberToNewGroup, function(i, object) {
         total++;
    });
    $("#total-no-of-memeber-add").html(total);
   },
   addMemberPermissionChanger :function(email,permission){  // main function
       if(permission==7 || permission==1 || permission==3){
           if(addMemberToNewGroup.hasOwnProperty(email)){
                addMemberToNewGroup[email]["permission"]=permission;
                return true;
            }
            else{
                 $.notify("Something is wrong, please try again", "error");
                 return false;
            }
       }
       else{
           $.notify("Something is wrong, please try again", "error");
           return false;
       }       
   },
   addMemberUnInvite :function(email,permission){  // main function
           if(addMemberToNewGroup.hasOwnProperty(email)){
               delete addMemberToNewGroup[email];
               application.data.group.updateTotalMembersInAddForm();
                return true;
            }
            else{
                 $.notify("Something is wrong, please try again", "error");
                 return false;
            }     
   },
     createNewGroup : function(gname,gdesc){
        // alert(gname);
        var url= url=application.config.getBasePath()+"groupcontroller/createGroup";
       perameters={name:gname,desc:gdesc,members:JSON.stringify(addMemberToNewGroup)};
       var res;
        $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
                
              res=jQuery.parseJSON( data );
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
            });
        if(res.status=="1"){
            $.notify("Group Added sucessfully");
            $('#groupModal').modal('hide');
            application.data.setUpGui();
            return true;
         }
         else{
             $("#AddGroupDangeralert #errorlog").html(res.error);
             $("#AddGroupDangeralert").show();
             return false;
        }
   },
   setFormForUpdateGroup : function(){
       var validate=application.data.group.check_permission(7);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
       //editorView.setValue(JSON.stringify(Json));
       var group=selectedGroup;
       $('#group-name-update').val(group.project_group_name);
       $('#group-desc-update').val(group.project_group_name);
       $('#group-members-update').empty();
       addMemberToNewGroup={};
      $.each(Members , function(i, object) {
          addMemberToNewGroup[object.user_email]={};
          addMemberToNewGroup[object.user_email]["permission"]=object.project_group_member_privilage_index;
          addMemberToNewGroup[object.user_email]["status"]=0;
      });
      application.data.group.setMembersInUpdateForm();
//      
   },
   setMembersInUpdateForm : function(){
       var validate=application.data.group.check_permission(7);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
       var group=selectedGroup;
       if(Members.hasOwnProperty(group.project_group_created_user_id)){
           var admin=Members[group.project_group_created_user_id];
            var html='<li id="member"><span class="glyphicon glyphicon-user "></span><div class="member-email">'+admin.user_email+'</div><span class="member-owner">Owner</span></li>';
             $('#group-members-update').append(html);
       }else{
           $.notify("Some thing wrong, please refresh your page", "error");
           $('#groupModalUpdate').modal('hide');
           return;
       }
       $.each(Members , function(i, object) {
          if(group.project_group_created_user_id!=object.user_id){
              var status=null;
              if(object.project_group_member_request_status==0) status="Un-Invite";
              else status="Remove";
              var options;
              if(object.project_group_member_privilage_index==7)options= '<option value="7" selected>'+perseven+'</option><option  value="3" >'+perthree+'</option><option  value="1" >'+perone+'</option>';
              else if(object.project_group_member_privilage_index==3)options= '<option  value="7" >'+perseven+'</option><option  value="3" selected>'+perthree+'</option><option  value="1" >'+perone+'</option>';
              else options= '<option  value="7" selected>'+perseven+'</option><option  value="3" >'+perthree+'</option><option  value="1" selected>'+perone+'</option>';
              var html='<li id="member">'+
                '<span class="glyphicon glyphicon-user "></span>'+
                '<div class="member-email" id="member-email-update">'+object.user_email+'</div>'+
                '<div class="member-permission">'+
                        '<select id="permission-member-update" class="form-control input-sm">'+
                                options+
                '</select>'+
                '</div>'+
                '<a class="member-remove" id="member-remove-update">'+status+'</a>'+
            '</li>';
             $('#group-members-update').append(html);
          }
          application.data.group.updateTotalMembersInUpdateForm();
      });
   },
   addMemberToUpdateGroupFrom :function(emailadd){  // main function
       var validate=application.data.group.check_permission(7);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
       if(addMemberToNewGroup.hasOwnProperty(emailadd) && addMemberToNewGroup[emailadd].status!=3){
           $("#new-member-email-update").notify("This member is alredy added","error");
            return;
       }
         var check=application.data.group.checkMemberForAddFrom(emailadd);
         if(check == -1){
             $("#new-member-email-update").notify("Not a valid email address","error");
            return;
         }
         else if(check > 0){
            $("#new-member-email-update").notify("This Email already invited in this group.","error");
            return;
         } 
         
          if(addMemberToNewGroup.hasOwnProperty(emailadd)){
             addMemberToNewGroup[emailadd]={};
             addMemberToNewGroup[emailadd]["permission"]=1;
             addMemberToNewGroup[emailadd]["status"]=2;
         }
         else{
             addMemberToNewGroup[emailadd]={};
             addMemberToNewGroup[emailadd]["permission"]=1;
             addMemberToNewGroup[emailadd]["status"]=1;
         }
         application.data.group.addMemberHtmlToUpdateGroupFrom(emailadd);
         //alert(JSON.stringify(addMemberToNewGroup));
         application.data.group.updateTotalMembersInUpdateForm();
         $("#new-member-email-update").val("");
   },
   addMemberHtmlToUpdateGroupFrom :function(email){  // sub function
       var validate=application.data.group.check_permission(7);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
       var status=null;
       if(addMemberToNewGroup[email]["status"]==2)status="Remove";
       else status="Un-Invite";
       var html='<li id="member">'+
	'<span class="glyphicon glyphicon-user "></span>'+
	'<div class="member-email" id="member-email-update">'+email+'</div>'+
	'<div class="member-permission">'+
		'<select id="permission-member-update" class="form-control input-sm">'+
			'<option value="7" >'+perseven+'</option>'+
			'<option value="3" >'+perthree+'</option>'+
			'<option value="1" selected>'+perone+'</option>'+
	'</select>'+
	'</div>'+
	'<a class="member-remove" id="member-remove-update">'+status+'</a>'+
    '</li>';
     $('#group-members-update').append(html);
   },
   updateTotalMembersInUpdateForm : function(){  // sub function
       var validate=application.data.group.check_permission(7);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
     var total=0;
     $.each( addMemberToNewGroup, function(i, object) {
         if(object["status"]!=3){total++;}         
    });
    $("#total-no-of-memeber-update").html(total);
   },
    updateMemberPermissionChanger :function(email,permission){  // main function
        var validate=application.data.group.check_permission(7);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
       if(permission==7 || permission==1 || permission==3){
           if(addMemberToNewGroup.hasOwnProperty(email)){
                addMemberToNewGroup[email]["permission"]=permission;
                if(addMemberToNewGroup[email]["status"]==0 || addMemberToNewGroup[email]["status"]==2){
                    addMemberToNewGroup[email]["status"]=2;
                }
                return true;
            }
            else{
                 $.notify("Something is wrong, please try again", "error");
                 return false;
            }
       }
       else{
           $.notify("Something is wrong, please try again", "error");
           return false;
       }       
   },
   updateMemberUnInvite :function(email,permission){  // main function
       var validate=application.data.group.check_permission(7);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
           if(addMemberToNewGroup.hasOwnProperty(email)){           
               if(addMemberToNewGroup[email]["status"]==1){
                    delete addMemberToNewGroup[email];
                }
                else{
                    addMemberToNewGroup[email]["status"]=3;
                }
               application.data.group.updateTotalMembersInUpdateForm();
                return true;
            }
            else{
                 $.notify("Something is wrong, please try again", "error");
                 return false;
            }     
   },
    updateGroup : function(gname,gdesc){
        var validate=application.data.group.check_permission(7);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
        var url= url=application.config.getBasePath()+"groupcontroller/updateGroup";
        perameters={groupid:selectedGroup.project_group_id,name:gname,desc:gdesc,members:JSON.stringify(addMemberToNewGroup)};
        var res;
        $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
              res=jQuery.parseJSON( data );
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
            });
        if(res.status=="1"){
            $.notify("Group updated sucessfully");
            $('#groupModalUpdate').modal('hide');
            application.data.setUpGui();
            return true;
         }
         else{
             $("#updateGroupDangeralert #errorlog").html(res.error);
             $("#updateGroupDangeralert").show();
             return false;
        }
   },
   deleteGroup : function(){ //delete group
       
       var group=selectedGroup;
       if(group.project_group_type=="1" || group.project_group_type=="2"){
           $.notify("You don't have right to delete this group.", "error");
           return;
       }
        var url= url=application.config.getBasePath()+"groupcontroller/deleteGroup";
        perameters={groupid:selectedGroup.project_group_id};
        var res;
        $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
               
              res=jQuery.parseJSON( data );
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
            });
        if(res.status=="1"){
            $.notify("Group deleted sucessfully");
            selectedGroup=null;
            //application.data.setUpGui();
            $(".personal-lib").trigger("click");
            return true;
         }
         else{
             $.notify(res.error,"error");
             return false;
        }      
   },
   getInvitesHtml : function(){
       var grps=Groups;
       var ht="";
       var permission=null;
        $.each( grps , function(i, object) {
            if(object.project_group_member_privilage_index=="1"){
                permission="viewer";
            }
            else if(object.project_group_member_privilage_index=="3"){
                permission="programmer";
            }
            else if(object.project_group_member_privilage_index=="7"){
                permission="manager";
            }
             if(object["project_group_member_request_status"]==0)
             {                 
                 if(ht==""){
                     ht='<a href="#" class="list-group-item tooltip-view" data-toggle="tooltip" data-placement="left" title="Tooltip on left">'+
                            '<div>'+'<div class="list-group-item-heading">'+
                                            '<div class="row">'+
                                                    '<div class="col-xs-12 col-md-12">'+
                                                            '<div class="group-name-invites">'+object["project_group_name"]+' ('+permission+')</div>'+
                                                            '<button type="button" id="declineGroupRequest" data-groupId="'+object["project_group_id"]+'" class="btn btn-danger btn-sm pull-right" style="margin-left:2px;">Decline</button>'+
                                                               '<button type="button" id="acceptGroupRequest" data-groupId="'+object["project_group_id"]+'" class="btn btn-success btn-sm pull-right">Accept</button>'+  
                                                    '</div>'+
                                            '</div>'+
                                    '</div>'+
                            '</div>'+
                        '</a>';
                 }
                 else{
                      ht+='<a href="#" class="list-group-item tooltip-view" data-toggle="tooltip" data-placement="left" title="Tooltip on left">'+
                            '<div>'+'<div class="list-group-item-heading">'+
                                            '<div class="row">'+
                                                    '<div class="col-xs-12 col-md-12">'+
                                                            '<div class="group-name-invites">'+object["project_group_name"]+' ('+permission+')</div>'+
                                                            '<button type="button" id="declineGroupRequest" data-groupId="'+object["project_group_id"]+'" class="btn btn-danger btn-sm pull-right" style="margin-left:2px;">Decline</button>'+
                                                               '<button type="button" id="acceptGroupRequest" data-groupId="'+object["project_group_id"]+'" class="btn btn-success btn-sm pull-right">Accept</button>'+        
                                                    '</div>'+
                                            '</div>'+
                                    '</div>'+
                            '</div>'+
                        '</a>';
                 }
             }
         }); 
         var html;
         if(ht!=""){
              html ='<div class="list-group-invites list-scrollbar-invites" id="list-scroll">'+ht+'</div>';
         }else{
             html="No request pending."
         }     
            return html;
   },
   userResponceToGroupRequest : function(groupId,respo){
       if(!Groups.hasOwnProperty(groupId)){     
           $.notify("You don't have access to this group", "error");
           return;
       }else{
           if(Groups[groupId].project_group_member_request_status!=0){
               $.notify("You already have access to this group", "error");
                return;
           }else{
               var url= url=application.config.getBasePath()+"groupcontroller/responceGroupInvite";
                perameters={groupid:groupId,responce:respo};
                var res;
                $.ajax({
                      type: 'POST',
                      url: url,
                      data: perameters,
                      async:false
                    }).done(function( data ) {
                      res=jQuery.parseJSON( data );
                      }).fail(function() {
                       $.notify("Cannot connect to server", "error");
                    });
                    if(res.status=="1"){
                        $.notify(res.data);
                        if(respo=="1"){
                            Groups[groupId].project_group_member_request_status=1;
                        }else{
                            delete Groups[groupId];
                        }
                        application.data.setUpGroup();
                        return true;
                     }
                     else{
                         $.notify(res.error,"error");
                         return false;
                    }      
           }
       }
   },
   check_permission: function(val){
       var grp=selectedGroup;
     //  alert("project name: "+selectedGroup.project_group_name+" permission: "+selectedGroup.project_group_member_privilage_index);
       var permi=selectedGroup.project_group_member_privilage_index;
       var type=selectedGroup.project_group_type;
       
       if(type == "1"){
           return false;
       }
       else if(type== "2"){
           if(val<=permi){
               return true;
           }else{
               return false;
           }
       }
       else if(type=="3"){
           if(val<=permi){
               return true;
           }else{
               return false;
           }
       }else{
           return false;
       }

   },
   getLeaveGroupHtml : function(){
       var group=selectedGroup;
       if(group.project_group_type!="3"){
           $.notify("You don't have permission to leave this group.", "error");
           return false;
       }
       var userid=UserDetail.user_id;var count=0;
       var option="";
       if(group.project_group_created_user_id==userid){
           $.each(Members , function(i, object) {
               count++;
             if(Members[i].user_id!=userid){
                if(option==""){
                   option='<option value="'+Members[i].user_id+'">'+Members[i].user_name+'</option>';
                }else{
                    option+='<option value="'+Members[i].user_id+'">'+Members[i].user_name+'</option>';
                }
             }
             //alert(option);
          });
          if(count==1){
              return "<p>You are only member of this group, you can't leave this group. you have to delete it.</p>"
          }
          var html='<div>'+'Manke administrator to: </br><select id="change-owner-select" class="form-control input-sm">'+option+'</select></br>'+
                            '<button type="button" id="leave-group-button" class="btn btn-danger btn-sm">Leave</button>'+
                            '<button type="button" class="btn btn-default btn-sm" data-dismiss="popover-cancel">Cancel</button>'+
                    '</div>';
            return html;
       }else{
            var html='<div>'+
                            '<button type="button" id="leave-group-button" class="btn btn-danger btn-sm">Leave</button>'+
                            '<button type="button" class="btn btn-default btn-sm" data-dismiss="popover-cancel">Cancel</button>'+
                    '</div>';
            return html;
       }     
   },
   leaveGroup : function(userid){
       var url,perameters;perameters={};
        url= url=application.config.getBasePath()+"groupcontroller/leaveGroup";
        var group=selectedGroup;
       if(userid!=null){
            perameters={groupid:group.project_group_id,new_owner_user_id:userid};
       }else{
            perameters={groupid:group.project_group_id};
       }
       $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
                //alert(data);
                 res=jQuery.parseJSON( data );
                 if(res.status=="1"){
                     $.notify(res.data);
                      $(".personal-lib").trigger("click");
                     return true;
                 }
                 else{
                     $.notify(res.error, "error");
                     return false;
                 }
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
        });
   }
}

application.data.labelrel={
    getFressLabelRel :function(){
         var timezone=application.config.getTimeZone();
        var perameters=null;//labelrel
        var url=null;  //selectedGroup["project_group_type"]=="2"
        if (typeof selectedGroup === "undefined" || selectedGroup === null) {   //            application.data.getFressData("125");
           url=application.config.getBasePath()+"labelrelcontroller/getUserPrivateData";
            perameters={timeZone:timezone};
        }
        else{
            //alert(Groups[groupId]);
            if(typeof Groups[selectedGroup.project_group_id] === "undefined")
            {  // false
                url=application.config.getBasePath()+"labelrelcontroller/getUserPrivateData";
                perameters={timeZone:timezone};
            }
            else
            { // true
                if(Groups[selectedGroup.project_group_id]["project_group_type"]=="3")
                {
                    url=application.config.getBasePath()+"labelrelcontroller/getUserGroupData";
                    var id=Groups[selectedGroup.project_group_id]["project_group_id"];
                    perameters={timeZone:timezone,groupId:id};
                }
                else if(Groups[selectedGroup.project_group_id]["project_group_type"]=="2")
                {
                    url=application.config.getBasePath()+"labelrelcontroller/getUserPrivateData";
                    perameters={timeZone:timezone};
                }

            }
        }         
            $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
                 res=jQuery.parseJSON( data );
                 if(res.status=="1"){
                     //$.notify("sucess");
                     responceData=res.data;
                     LabelRel=responceData["labelrel"];
                     application.data.labelrel.setLabelRels();
                     return true;
                 }
                 else{
                    $.notify(res.error, "error");
                    return false;
                 }
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });
    },
    refressLabelRel : function(){
        var datajson=null;
        datajson=this.getFressLabelRel();
        if(datajson==false){
            $.notify("Cannot ritrive data from databse", "error")
            return;
        }
    },
    setLabelRels : function(){
        LabelRelSnipWise={};
        LabelRelLabelWise={}; //<span id="label1" class="snippet-label label-color-1">Important</span>
        if(!jQuery.isEmptyObject( LabelRel )){
            $.each(LabelRel, function(i, object) {                
                $.each(object, function(property, value) {
                        if(!LabelRelLabelWise.hasOwnProperty(value['label_id']))
                        {
                            LabelRelLabelWise[value['label_id']]={};
                        }
                        if(!LabelRelLabelWise[value['label_id']].hasOwnProperty(value['label_creaed_device_id']))
                        {
                            LabelRelLabelWise[value['label_id']][value['label_creaed_device_id']]=[];
                        }
                        LabelRelLabelWise[value['label_id']][value['label_creaed_device_id']].push({snippet_id:value['snippet_id'],snippet_created_device_id:value['snippet_created_device_id'],snippet_label_relation_id:value['snippet_label_relation_id'],snippet_label_relation_created_device_id:value['snippet_label_relation_created_device_id']});   

                        if(!LabelRelSnipWise.hasOwnProperty(value['snippet_id']))
                        {
                            LabelRelSnipWise[value['snippet_id']]={};
                        }
                        if(!LabelRelSnipWise[value['snippet_id']].hasOwnProperty(value['snippet_created_device_id']))
                        {
                            LabelRelSnipWise[value['snippet_id']][value['snippet_created_device_id']]=[];
                        }
                        LabelRelSnipWise[value['snippet_id']][value['snippet_created_device_id']].push({label_id:value['label_id'],label_creaed_device_id:value['label_creaed_device_id'],snippet_label_relation_id:value['snippet_label_relation_id'],snippet_label_relation_created_device_id:value['snippet_label_relation_created_device_id']});    

                });
            });       
        }
    },
    getLabelWiseTotalSnip : function(lid,lcdid){
        if(!LabelRelLabelWise.hasOwnProperty(lid))
        {
            return 0;
        }
        else if(!LabelRelLabelWise[lid].hasOwnProperty(lcdid))
        {
            return 0;
        }
        else{
            return LabelRelLabelWise[lid][lcdid].length;
        }
    },
    getTotalSnipWithNoLabel :function(){
        var count=0;
        $.each(Snippets , function(i, object) {  
            $.each(object, function(property, value) {
                    if(LabelRelSnipWise.hasOwnProperty(i) && LabelRelSnipWise[i].hasOwnProperty(property))
                    {
                        return 0;
                    }
                    else{     
                           count++;
                    }
            });
         });
         return count;
    },
    getSnipWiseTotalLabel : function(sid,sdid){
        if(!LabelRelSnipWise.hasOwnProperty(sid))
        {
            return 0;
        }
        else if(!LabelRelSnipWise[sid].hasOwnProperty(scdid))
        {
            return 0;
        }
        else{
            return LabelRelSnipWise[sid][scdid].length;
        }
    },
    getLabelsOfSnip : function(sid,sdid){
        if(!LabelRelSnipWise.hasOwnProperty(sid))
        {
            return 0;
        }
        else if(!LabelRelSnipWise[sid].hasOwnProperty(sdid))
        {
            return 0;
        }
        else{
            return LabelRelSnipWise[sid][sdid];
        }
    },
    getLabelsOfSnipHtml : function(sid,scdid){
        var labs=application.data.labelrel.getLabelsOfSnip(sid, scdid);
        var labshtml="";
        if(labs!=0){
            $.each(labs, function(i, item) {
                var lab=application.data.label.getLabel(item.label_id, item.label_creaed_device_id);
                if(lab!=0){
                   if(labshtml==""){
                       labshtml='<span id="label" data-relid='+item.label_id+' data-relcdid='+item.label_creaed_device_id+' class="snippet-label label-color-'+lab.label_color_id+'">'+lab.label_name+'</span>';
                   }else{
                       labshtml+='<span id="label" data-relid='+item.label_id+' data-relcdid='+item.label_creaed_device_id+' class="snippet-label label-color-'+lab.label_color_id+'">'+lab.label_name+'</span>';
                   }
                }
            });
        }
        return labshtml;
    },
    getLabelsHtmlForCreateSnip : function(){
        var lab="";
        var flag=false;
        if(jQuery.isEmptyObject( snipLabelForCreateSnip)){
            flag=true;
        }
         if(!jQuery.isEmptyObject( Labels )){
            $.each(Labels, function(i, object) {                
                $.each(object, function(property, value) {
                    if(lab==""){
                        lab='<li data-name="'+value["label_name"]+'" >'+
                                    '<span><input type="checkbox" id="labelcheckboxadd" data-labid="'+value['label_id']+'" data-labcdid="'+value['label_creaed_device_id']+'" name="select-label"></span>'+
                                    '<span class="label-name"> '+value["label_name"]+'</span>'+
                                    '<span class="label-color label-color-'+value["label_color_id"]+'" style="margin-top: -10px;"></span>'+
                            '</li>';
                    }else{
                        lab+='<li data-name="'+value["label_name"]+'" >'+
                                    '<span><input type="checkbox" id="labelcheckboxadd" data-labid="'+value['label_id']+'" data-labcdid="'+value['label_creaed_device_id']+'" name="select-label"></span>'+
                                    '<span class="label-name"> '+value["label_name"]+'</span>'+
                                    '<span class="label-color label-color-'+value["label_color_id"]+'" style="margin-top: -10px;"></span>'+
                            '</li>';
                    }
                    if(flag==true){
                        snipLabelForCreateSnip[value['label_id']]={};
                        snipLabelForCreateSnip[value['label_id']][value['label_creaed_device_id']]={checked:"0"};
                    }
                });
            });
        }
      var html='<div>'+
                        '<div class="pick-labels-container" id="pick-labels-container-scroll">'+
                                '<input type="text" class="form-control input-sm" placeholder="search" id="label-add-search" >'+
                                '<ul class="pick-labels">'+lab+
                                '</ul>'+
                        '</div>'+                 
                '</div>';
            return html;
    },
    checkedBydefaultAddSnip : function(){
        if(!jQuery.isEmptyObject( snipLabelForCreateSnip)){
            $.each(snipLabelForCreateSnip,function(i,object){
                 $.each(object,function(j,property){
                    if(snipLabelForCreateSnip[i][j].checked=="1"){
                        $("li #labelcheckboxadd[data-labid='"+i+"'][data-labcdid='"+j+"']").prop('checked', true);
                    }
                 });
            });
        }
    },
    getLabelsHtmlForUpdateSnip : function(){
        var lab="";
         if(!jQuery.isEmptyObject( Labels )){
            $.each(Labels, function(i, object) {                
                $.each(object, function(property, value) {
                    if(lab==""){
                        lab='<li data-name="'+value["label_name"]+'" >'+
                                    '<span><input type="checkbox" id="labelcheckboxupdate" data-labid="'+value['label_id']+'" data-labcdid="'+value['label_creaed_device_id']+'" name="select-label"></span>'+
                                    '<span class="label-name"> '+value["label_name"]+'</span>'+
                                    '<span class="label-color label-color-'+value["label_color_id"]+'" style="margin-top: -10px;"></span>'+
                            '</li>';
                    }else{
                        lab+='<li data-name="'+value["label_name"]+'" >'+
                                    '<span><input type="checkbox" id="labelcheckboxupdate" data-labid="'+value['label_id']+'" data-labcdid="'+value['label_creaed_device_id']+'" name="select-label"></span>'+
                                    '<span class="label-name"> '+value["label_name"]+'</span>'+
                                    '<span class="label-color label-color-'+value["label_color_id"]+'" style="margin-top: -10px;"></span>'+
                            '</li>';
                    }
                    snipLabelForUpdateSnip[value['label_id']]={};
                    snipLabelForUpdateSnip[value['label_id']][value['label_creaed_device_id']]={checked:"0",status:"0"};
                });
            });
        }
         var html='<div>'+
                        '<div class="pick-labels-container" id="pick-labels-container-scroll">'+
                                '<input tupe="text" class="form-control input-sm" placeholder="search" id="label-update-search" >'+
                                '<ul class="pick-labels" id="update-snip-label-rel">'+lab+
                                '</ul>'+
                        '</div>'+                 
                '</div>';
            return html;
    },
    setSelectedLabelsForUpdateSnip : function(){
        var snip=selectedSnip;
        var labs=application.data.labelrel.getLabelsOfSnip(snip.snippet_id,snip.snippet_created_device_id);
        if(labs!=0){
            $.each(labs, function(i, item) {
                $("li #labelcheckboxupdate[data-labid='"+item.label_id+"'][data-labcdid='"+item.label_creaed_device_id+"']").prop('checked', true);
            });
        }        
    },
    getHtmlOfLabel : function(lid,lcdid){
       var item=  application.data.label.getLabel(lid, lcdid);
       if(item!=0){
          var labshtml='<span id="label" data-relid='+item.label_id+' data-relcdid='+item.label_creaed_device_id+' class="snippet-label label-color-'+item.label_color_id+'">'+item.label_name+'</span>';
           return labshtml;
       }else{
           $.notify("Label not found", "error");
           return 0;
       }
    },
   addSnipLabelChecked : function(lid,lcdid,status){//add-snip-label-container
       var item=  application.data.label.getLabel(lid, lcdid);
       if(item!=0){
          if(status==1){
              snipLabelForCreateSnip[lid][lcdid].checked="1";
              var html=application.data.labelrel.getHtmlOfLabel(lid, lcdid);
              $("#add-snip-label-container").append(html);
              return 1;
          }else{
              snipLabelForCreateSnip[lid][lcdid].checked="0";
              $("#add-snip-label-container #label[data-relid="+lid+"][data-relcdid="+lcdid+"]").remove();
              return 1;
          }
          
       }else{
           $.notify("Label not found", "error");
           return 0;
       }
    },
    updateSnipLabelChecked : function(lid,lcdid,status){//add-snip-label-container
       var item=  application.data.label.getLabel(lid, lcdid);
       if(item!=0){
          if(status==1){
              snipLabelForUpdateSnip[lid][lcdid].checked="1";
              if(snipLabelForUpdateSnip[lid][lcdid].status=="0"){
                  snipLabelForUpdateSnip[lid][lcdid].status="1";
              } else if(snipLabelForUpdateSnip[lid][lcdid].status=="2"){
                  snipLabelForUpdateSnip[lid][lcdid].status="0";
              }
              var html=application.data.labelrel.getHtmlOfLabel(lid, lcdid);
              $("#snippet-label-container").append(html);
             // alert(JSON.stringify(snipLabelForUpdateSnip));
              return 1;
          }else{
              snipLabelForUpdateSnip[lid][lcdid].checked="0";
              if(snipLabelForUpdateSnip[lid][lcdid].status=="0"){
                  snipLabelForUpdateSnip[lid][lcdid].status="2";
              } else if(snipLabelForUpdateSnip[lid][lcdid].status=="1"){
                  snipLabelForUpdateSnip[lid][lcdid].status="0";
              }
              $("#snippet-label-container #label[data-relid="+lid+"][data-relcdid="+lcdid+"]").remove();
             //  alert(JSON.stringify(snipLabelForUpdateSnip));
              return 1;
          }
       }else{
           $.notify("Label not found", "error");
           return 0;
       }
    },
    updateSnippetLabels : function(){
        var validate=application.data.group.check_permission(3);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
        var send=false;
        if(jQuery.isEmptyObject( snipLabelForUpdateSnip)){
                 return;
           }
        $.each(snipLabelForUpdateSnip, function(i, object) { // chaeck any updated?
            $.each(object, function(property, value) {
                if(value["status"]!="0"){
                    send=true;
                    return 0;
                }
            });
        });
        if(send==true){
            var perameters={};
            var url=application.config.getBasePath()+"labelrelcontroller/updateLabelsRels";
            perameters["snippet"]=selectedSnip;
            if(!jQuery.isEmptyObject( snipLabelForUpdateSnip)){
                 perameters["labels"]=snipLabelForUpdateSnip;
            }else{
                perameters["labels"]=0;
            } 
           // return;
            $.ajax({
                  type: 'POST',
                  url: url,
                  data: perameters,
                  async:false
                }).done(function( data ) {
                    snipLabelForUpdateSnip={};
                     res=jQuery.parseJSON( data );
                     
                     if(res.status=="1"){
                         $.notify(res.data);
                         application.data.labelrel.refressLabelRel();
                         application.data.labelrel.setLabelRels();
                         application.data.setUPsnipeets(true);
                         $(".label-list-container").empty();
                         application.data.setUPlebels();
                         return true;
                     }
                     else{
                         $.notify(res.error, "error");
                         return false;
                     }
                  }).fail(function() {
                   $.notify("Cannot connect to server", "error");
                });
        }
    }
    
}

application.data.user ={
  
    getUserEmail : function(){
        var url= url=application.config.getBasePath()+"appcontroller/getUserEmail";
        var res;
        $.ajax({
              type: 'POST',
              url: url,
              async:false
            }).done(function( data ) {
               // alert(data);
              res=jQuery.parseJSON( data );
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });
            if(res.status=="1"){
             //  $.notify("sucess get email");
               return res.data;
           }
           else{
             //  $.notify(res.error, "error get email");
               return false;
           }
    },
     getPublicGroupId : function(){
        var url= url=application.config.getBasePath()+"appcontroller/getPublicGroupId";
        var res;
        $.ajax({
              type: 'POST',
              url: url,
              async:false
            }).done(function( data ) {
               // alert(data);
              res=jQuery.parseJSON( data );
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });
            if(res.status=="1"){
              // $.notify("sucess get group id");
               return res.data;
           }
           else{
             //  $.notify(res.error, "error get group id");
               return false;
           }
    },
    getUserId : function(){
        var url= url=application.config.getBasePath()+"appcontroller/getUserId";
        var res;
        $.ajax({
              type: 'POST',
              url: url,
              async:false
            }).done(function( data ) {
               // alert(data);
              res=jQuery.parseJSON( data );
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });
            if(res.status=="1"){
               //$.notify("sucess get group id");
               return res.data;
           }
           else{
             //  $.notify(res.error, "error get group id");
               return false;
           }
    },
    changepassResetForm :function(){
        $("#cr-pass").val("");
        $("#nw-pass").val("");
        $("#cf-pass").val("");
        $("#ChangePassDangeralert").hide();
    },
    changepass : function(){
        $("#ChangePassDangeralert").hide();
         var url= url=application.config.getBasePath()+"appcontroller/changePass";
         var perameters=$("#change-pass-form").serialize();
         //alert(perameters);
        var res;
        $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
              res=jQuery.parseJSON( data );
               if(res.status=="1"){
                   $('#changepass').modal('hide');
                     $.notify(res.data);
                }
                else{
                    $("#ChangePassDangeralert").html(res.error);
                    $("#ChangePassDangeralert").show();                    
                }
           
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });           
    }
}

application.data.file = {
    addFileToList : function(fid,fcdid){
        var fi=Files[fid][fcdid];
        var html='<li>'+
	'<a href="#">'+
                        '<span class="fa fa-file-text glyph-width"></span><span class="sidebar-file-name">'+fi["file_name"]+'</span>'+
                        '<span class="glyphicon glyphicon-trash pull-right" data-fid="'+fi["file_id"]+'" data-fcdid="'+fi["file_creaed_device_id"]+'" id="delete-file-popover" data-original-title="title" title="Delete File"></span>'+
                        '<span class="glyphicon glyphicon-download-alt glyph-width pull-right" id="download-file" data-fid="'+fi["file_id"]+'" data-fcdid="'+fi["file_creaed_device_id"]+'" ></span>'+
                '</a>'+
        '</li>';
        $(".file-list-container").prepend(html);
    },
    getDeletePopoverHtml :function(id,fcdid){
        return '<div>'+
            '<button type="button" id="delete-selected-file" data-fid="'+id+'" data-fcdid="'+fcdid+'" class="btn btn-danger btn-sm">Delete</button>'+
            '<button type="button" class="btn btn-default btn-sm" data-dismiss="popover-cancel">Cancel</button>'+
        '</div>';
    },
    getUploadFileHtml:function(){
        return '<div id="fileadd" style="width: 250px;">'+
                '<div>'+
                '<form method="post" id="add-file-form" action="'+application.config.getBasePath()+'filecontroller/uploadFile" enctype="multipart/form-data">'+
                    '<div>'+                        
                            '<input type="file" name="file" id="file" />'+                                
                    '</div>'+
                    '<div style="margin-top: 10px;">'+
                        '<button type="submit"id="add_file" class="btn btn-primary btn-sm pull-right">Save</button>'+
                        '<button type="button" class="btn btn-default btn-sm pull-right glyph-width" data-dismiss="popover-cancel" >Cancel</button>'+
                    '</div>'+
                    '</form>'+    
                '</div>'+
            '</div>';
    },
    uploadFile : function(fdata){
        $('.popover').remove();
        $.notify("Please do not refresh page,Uploading in process....", { className: "info" , position:"bottom left",clickToHide: false,autoHide: false});
                var formObj = $(fdata);
                var formURL = formObj.attr("action");
                var formData = new FormData(fdata);
                formData.append("geoupId",selectedGroup.project_group_id);
                $.ajax({
                    url: formURL,
                type: 'POST',
                    data:  formData,
                mimeType:"multipart/form-data",
                contentType: false,
                    cache: false,
                    processData:false,
                success: function(data, textStatus, jqXHR)
                {
                   res=jQuery.parseJSON( data );
                        if(res.status=="1"){
                            $(".notifyjs-corner").empty();
                            application.data.file.refressFile();
                           $.notify(res.data);
                       }
                       else{
                           $(".notifyjs-corner").empty();
                           $.notify(res.error,"error");
                       }
                },
                 error: function(jqXHR, textStatus, errorThrown) 
                 {
                     $.notify("something Wrong with server.","error");
                 }          
                });
    },
     getFressFiles :function(){
        var validate=application.data.group.check_permission(1);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
         var timezone=application.config.getTimeZone();
        var perameters=null;
        var url=null;  //selectedGroup["project_group_type"]=="2"
        if (typeof selectedGroup === "undefined" || selectedGroup === null) {   //            application.data.getFressData("125");
           url=application.config.getBasePath()+"filecontroller/getUserPrivateData";
            perameters={timeZone:timezone};
        }
        else{
            //alert(Groups[groupId]);
            if(typeof Groups[selectedGroup.project_group_id] === "undefined")
            {  // false
                url=application.config.getBasePath()+"filecontroller/getUserPrivateData";
                perameters={timeZone:timezone};
            }
            else
            { // true
                if(Groups[selectedGroup.project_group_id]["project_group_type"]=="3")
                {
                    url=application.config.getBasePath()+"filecontroller/getUserGroupData";
                    var id=Groups[selectedGroup.project_group_id]["project_group_id"];
                    perameters={timeZone:timezone,groupId:id};
                }
                else if(Groups[selectedGroup.project_group_id]["project_group_type"]=="2")
                {
                    url=application.config.getBasePath()+"filecontroller/getUserPrivateData";
                    perameters={timeZone:timezone};
                }

            }
        }         
            $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
                 res=jQuery.parseJSON( data );
                 if(res.status=="1"){
                     //$.notify("sucess");
                     responceData=res.data;
                     Files=responceData["file"];
                     return true;
                 }
                 else{
                    $.notify(res.error, "error");
                    return false;
                 }
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });
    },
    refressFile : function(){
        $(".file-list-container").empty();
        var datajson=null;
        datajson=application.data.file.getFressFiles();
        if(datajson==false){
            $.notify("Cannot ritrive data from databse", "error")
            return;
        }
        application.data.setUPfiles();
    },
    deleteFile :function(id,fcdid){
         var validate=application.data.group.check_permission(3);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
        if(!Files.hasOwnProperty(id) || !Files[id].hasOwnProperty(fcdid)){
            $.notify("data inconsistent", "error");
            return null;
        }
        var lab=Files[id][fcdid];
        $.post( application.config.getBasePath()+"filecontroller/deleteFile",lab,function( data ) {
            var res=jQuery.parseJSON( data );
            if(res.status==1){
                $.notify(res.data);       
                 delete Files[id][fcdid];
                 $(".popover").remove();
                   $(".file-list-container").empty();
                 application.data.setUPfiles();
            }
            else{
                $(".popover").remove();
                $.notify(res.error, "error");                  
            }            

         });
         return null;
    },
    downloadFile :function(fid,fcdid){
         var validate=application.data.group.check_permission(1);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        }
        if(!Files.hasOwnProperty(fid) || !Files[fid].hasOwnProperty(fcdid)){
            $.notify("data inconsistent", "error");
            return null;
        }
        var lab=Files[fid][fcdid];
        var url=application.config.getBasePath()+"filecontroller/downloadFile/"+lab.file_project_group_id+"/"+fid+"/"+fcdid;
        var win=window.open(url, '_blank');  
    }
}

application.data.backuprestore={
    downloadBackup :function(){
         var validate=application.data.group.check_permission(1);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        } 
        var url=application.config.getBasePath()+"appcontroller/downloadBackup/"+selectedGroup.project_group_id;
        var win=window.open(url, '_blank');  
        
    },
    downloadSnipBackup:function(){
            var validate=application.data.group.check_permission(1);
        if(validate==false){
            $.notify("Access denied.", "error");
            return;
        } 
        var url=application.config.getBasePath()+"appcontroller/downloadSnipBackup/"+selectedSnip.snippet_id+"/"+selectedSnip.snippet_created_device_id;
        var win=window.open(url, '_blank');  
    },
     getUploadBackupHtml:function(){
        return '<div id="fileadd" style="width: 250px;">'+
                '<div>'+
                '<form method="post" id="upload-backup-form" action="'+application.config.getBasePath()+'appcontroller/restoreBackup" enctype="multipart/form-data">'+
                    '<div>'+                        
                            '<input type="file" name="backupfile"accept="application/xml" id="backupfile" />'+                                
                    '</div>'+
                    '<div style="margin-top: 10px;">'+
                        '<button type="submit"id="restore_file" class="btn btn-primary btn-sm pull-right">Restore</button>'+
                        '<button type="button" class="btn btn-default btn-sm pull-right glyph-width" data-dismiss="popover-cancel" >Cancel</button>'+
                    '</div>'+
                    '</form>'+    
                '</div>'+
            '</div>';
    },
     uploadBackup : function(fdata){
        $('.popover').remove();
        $.notify("Please do not refresh page,Restore in process....", { className: "info" , position:"bottom left",clickToHide: false,autoHide: false});
                var formObj = $(fdata);
                var formURL = formObj.attr("action");
                var formData = new FormData(fdata);
                formData.append("geoupId",selectedGroup.project_group_id);
                $.ajax({
                    url: formURL,
                     type: 'POST',
                    data:  formData,
                    mimeType:"multipart/form-data",
                    contentType: false,
                    cache: false,
                    processData:false,
                success: function(data, textStatus, jqXHR)
                {
                  //  alert(data);
                   res=jQuery.parseJSON( data );
                        if(res.status=="1"){
                            $.notify(res.data);
                            $(".notifyjs-corner").empty();
                            application.data.snippet.refressSnippet(false);                           
                       }
                       else{
                           $(".notifyjs-corner").empty();
                           $.notify(res.error,"error");
                       }
                },
                 error: function(jqXHR, textStatus, errorThrown) 
                 {
                     $.notify("something Wrong with server.","error");
                 }          
                });
    }
}
application.data.feedback ={
    addFeedback : function(){
        var ftype=$("#feedback-type").val();
        var fval=$("#feedback-detail").val();
        var url= url=application.config.getBasePath()+"feedbackcontroller/addFeedback";
        var perameters={type:ftype,val:fval};
         $.ajax({
              type: 'POST',
              url: url,
              data: perameters,
              async:false
            }).done(function( data ) {
               // alert(data);
                 res=jQuery.parseJSON( data );
                 if(res.status=="1"){
                     $.notify(res.data);
                     $("#feedbackModal").modal('hide');
                     return true;
                 }
                 else{
                    $.notify(res.error, "error");
                     $("#feedbackModal").modal('hide');
                    return false;
                 }
              }).fail(function() {
               $.notify("Cannot connect to server", "error");
               return false;
            });
        
    }
}


application.event = {
    setUpOneTimeEvent :function(){
        $("#snip_save_btn").click(function(){      //   create snippet
            application.data.snippet.addSnippet();
        });
        $("#snipLanAdd").change(function(e){   //   change lan dropdown
            var optionSelected = $("option:selected", this);
            editorAdd.getSession().setMode("ace/mode/"+this.value);         
        });
        $("#snip-lan-update").change(function(e){   //   change lan dropdown
            var optionSelected = $("option:selected", this);
            editorUpdate.getSession().setMode("ace/mode/"+this.value);         
        });
        $(document).on("click", "#delete-selected-snip", function() { //   delete snippet
            application.data.snippet.deleteSelectedSnip();
        });
        $(document).on("click","#update-selected-snip",function() {   //   update snippet gui change
            application.data.snippet.setDataForUpdate();
            $("#snippet-details").hide();
            $("#snippet-details-edit").show();
         });
         $(document).on("click","#update-snip-button" ,function() {  // upade snippet
            application.data.snippet.updateSnippet();
         });
         $('#createModal').on('show.bs.modal', function (e) {  // add snippet reset form
            application.data.snippet.resetAddSnipForm();
          }); 
          $('#changepass').on('show.bs.modal', function (e) {  // add snippet reset form
            application.data.user.changepassResetForm();
          }); 
          $('#createModal').on('hide.bs.modal', function (e) {  // add snippet hide form 
            $(".popover").remove();
          }); 
           $('#update-snip-label-rel').on('show.bs.popover', function (e) {  // update snip label rel open
                 snipLabelForUpdateSnip={};
                 $(".popover").remove();
          });
          $('#naw-file-add').on('shown.bs.popover', function (e) {  // add file popover 
                 $('#file').bootstrapFileInput();
          });
          
          $('#restore-btn').on('shown.bs.popover', function (e) {  // add file popover 
                 $('#backupfile').bootstrapFileInput();
          });
          
           $('[rel=select-modal-label-popover]').on('shown.bs.popover', function (e) {  // update snip label rel open
                application.data.labelrel.checkedBydefaultAddSnip();
          });
          $('#update-snip-label-rel').on('shown.bs.popover', function (e) {  // update snip label rel open
              application.data.labelrel.setSelectedLabelsForUpdateSnip();
          }); 
          $('#update-snip-label-rel').on('hidden.bs.popover', function (e) {  // update snip label rel close
              application.data.labelrel.updateSnippetLabels();
          }); 
          
          $('#copy-to-groups').on('show.bs.popover', function (e) {  // update snip label rel open
                copySnipToGroup={};
                 $(".popover").remove();
          });  
          $('#copy-to-groups').on('hidden.bs.popover', function (e) {  // update snip label rel close
            application.data.snippet.copySnipToGroup();
          }); 
          $(document).on("click",'#labelcheckboxadd' ,function() {   //   add snippet label check box
            var  lid=$(this).attr("data-labid");
            var  lcdid=$(this).attr("data-labcdid");
            var res;
             if($(this).is(':checked')){
                 res=  application.data.labelrel.addSnipLabelChecked(lid, lcdid, 1);
             }else{
                res=  application.data.labelrel.addSnipLabelChecked(lid, lcdid, 0);
            }
         }); 
         $(document).on("click",'#groupcheckboxadd' ,function() {   //   add snippet label check box
            var  gid=$(this).attr("data-labid");
            var res;
             if($(this).is(':checked')){
                 res=  application.data.snippet.copySnipChecked(gid, 1);
             }else{
                res=  application.data.snippet.copySnipChecked(gid, 0);
            }
         });
         $(document).on("click",'#labelcheckboxupdate' ,function() {   //   add snippet label check box
            var  lid=$(this).attr("data-labid");
            var  lcdid=$(this).attr("data-labcdid");
            var res;
             if($(this).is(':checked')){
                 res=  application.data.labelrel.updateSnipLabelChecked(lid, lcdid, 1);
             }else{
                res=  application.data.labelrel.updateSnipLabelChecked(lid, lcdid, 0);
            }
         });
           $('#groupModal').on('show.bs.modal', function (e) {  // add group reset form
            application.data.group.resetAddGroupform();
          });
          $('#groupModalUpdate').on('show.bs.modal', function (e) {  // update group set form
            application.data.group.setFormForUpdateGroup();
          });
          $('#feedbackModal').on('show.bs.modal', function (e) {  // update group set form
            $("#feedback-detail").val("");
            $("#feedback-type").val("idea");
          });
          $(document).on("click","#feedback-submit",function(){
              if($("#feedback-detail").val()==""){
                  $("#feedback-detail").notify("give your feedback", "error");
              }else{
                  application.data.feedback.addFeedback();
              }
          });
          $(document).on("click", "#add_label", function() {   // create label
            var name=$("#label_name_add").val();
            var col=$("div#add-label-color-labels span.label-color-selected").attr("data-id");
            if(name=="" || name==null){
                $('input#label_name_add').notify("Please enter name", "error");
                return;
            }
            if(col == undefined){
                $('div#add-label-color-labels').notify("Please select color", "error");
                return;
            }
            application.data.label.addNewLabel(name,col);     
             $(".popover").remove();
        });        
        
         $(document).on("click","#close-snip-ver",function(){
            $("#snippet-details").show();
            $("#snippet-details-edit").hide();
             $(".snippet-version-containor").hide();
         });
        $(document).on("click", "#update_label", function() {   // update label
            var name=$("#label_name_update").val();
            var col=$("div#update-label-color-labels span.label-color-selected").attr("data-id");
            var id=$(this).attr('data-id');
            var cid=$(this).attr('data-lcdid');
            if(name=="" || name==null){
                $('input#label_name_update').notify("Please enter name", "error");
                return;
            }
            if(col == undefined){
                $('div#update-label-color-labels').notify("Please select color", "error");
                return;
            }
             $(".popover").remove();
            application.data.label.updateLabel(name,col,id,cid); 
            
        });
        $(document).on("click", "#delete_label", function() {   // delete label
            var id=$(this).attr('data-id')
            var cid=$(this).attr('data-lcdid');
            application.data.label.deleteLabel(id,cid); 
            $(".popover").remove();
        });
         $(document).on("click", "#add-label-color-labels span", function(e) {  // add clabel color setting
            $(this).addClass('label-color-selected');
            $(this).siblings().removeClass('label-color-selected');
            
        });
        $(document).on("click", "#update-label-color-labels span", function(e) {  // update label color setting
            $(this).addClass('label-color-selected');
            $(this).siblings().removeClass('label-color-selected');
            
        });
        $(document).on("click","#cpass-submit",function(){
           application.data.user.changepass(); 
        });
         $(document).on("click", ".dropdown-menu #groupDropdownOption", function() { // select group or public or ptivate
            //alert($(this).attr("data-id"));
             $("#groupDropdownSelect").html($(this).find("a").html());
             selectedGroup=Groups[$(this).attr("data-id")];
             application.data.setUpGui();
        });
         $(document).on("click", ".snippet-list-item", function() {  //  senippet list item clcked
            var snipId=$(this).attr("data-snippetid");
             var scdid=$(this).attr("data-scdid");
            $(this).addClass('selected-snippet');
            $(this).siblings().removeClass('selected-snippet');
             application.data.snippet.snippetSelected(snipId, scdid);
        });
        $(document).on("click", "#editLabelPopover", function(e) {  // edit label popover
            var id=$(this).attr('data-id');
            var cid=$(this).attr('data-lcdid')
                 $(this).popover({
                    placement: "bottom",
                    title: "Edit Label",
                    container: "body",
                    trigger: 'manual',
                    html : true, 
                    content: function() {
                      return application.data.label.geneditpopover(id, cid);
                    }
                });
                if($(this).hasClass('pop')) {
                    $(this)
                        .popover('hide')
                        .removeClass('pop');
                } else {
                    $(this)
                        .popover('show')
                        .addClass('pop');
                }
               // e.stopPropagation();
        });
        $(document).on("click","#update-snip-label-rel",function(e){
                        e.stopPropagation();
             $('#update-snip-label-rel').popover({
                    placement: "bottom",
                    title: "Edit Snippet Labels",
                     trigger: 'manual',
                    container: "body",
                    html : true, 
                    content: function() {
                         return application.data.labelrel.getLabelsHtmlForUpdateSnip();                    
                    }
                });
               if($(this).hasClass('pop')) {
                    $(this)
                        .popover('hide')
                        .removeClass('pop');
                } else {
                    $(this)
                        .popover('show')
                        .addClass('pop');
                }
        });
        $(document).on("click","#copy-to-groups",function(e){
              e.stopPropagation();
             $('#copy-to-groups').popover({
                    placement: "bottom",
                    title: "Copy To Groups",
                     trigger: 'manual',
                    container: "body",
                    html : true, 
                    content: function() {
                        return application.data.snippet.copySnipTOGroupHtml();
                    }
                });
               if($(this).hasClass('pop')) {
                    $(this)
                        .popover('hide')
                        .removeClass('pop');
                } else {
                    $(this)
                        .popover('show')
                        .addClass('pop');
                }
        });
        $(document).on("click", "#delete-file-popover", function(e) {  // edit label popover
            var id=$(this).attr('data-fid');
            var cid=$(this).attr('data-fcdid');
                 $(this).popover({
                    placement: "bottom",
                    title: "Delete File",
                    container: "body",
                     trigger: 'manual',
                    html : true, 
                    content: function() {
                      return application.data.file.getDeletePopoverHtml(id,cid);
                    }
                });
                 if($(this).hasClass('pop')) {
                    $(this)
                        .popover('hide')
                        .removeClass('pop');
                } else {
                    $(this)
                        .popover('show')
                        .addClass('pop');
                }
               // e.stopPropagation();
        });
        $(document).on("click", "#download-file", function(e) {  // edit label popover
            var id=$(this).attr('data-fid');
            var cid=$(this).attr('data-fcdid');
               application.data.file.downloadFile(id,cid);
        });
        
        
        $(document).on("click", "#add-member-button", function() {  //  add member for create group
            var email=$("#new-member-email-add").val();
            if(email==""){
                $("#new-member-email-add").notify("please Enter email address","error");
            }
             else{
                 application.data.group.addMemberToAddGroupFrom(email);
             }
        });
        $(document).on("keyup", "#label-update-search", function() {  //  search label update snip
           var div= $(this).parent();
           if($(this).val()==""){
               div.find("ul#update-snip-label-rel li").show();
               return;
           }
           div.find("ul#update-snip-label-rel li[data-name*='"+$(this).val()+"']").show();
           div.find("ul#update-snip-label-rel li:not([data-name*='"+$(this).val()+"'])").hide();
        });
        
        $(document).on("keyup", "#label-add-search", function() {  //  search label update snip
           var div= $(this).parent();
           if($(this).val()==""){
               div.find("ul li").show();
               return;
           }
           div.find("ul li[data-name*='"+$(this).val()+"']").show();
           div.find("ul li:not([data-name*='"+$(this).val()+"'])").hide();
        });
        
        $(document).on("click", "#update-member-button", function() {  //  add member for create group
            var email=$("#new-member-email-update").val();
            if(email==""){
                $("#new-member-email-update").notify("please Enter email address","error");
            }
             else{
                 application.data.group.addMemberToUpdateGroupFrom(email);
             }
        });
        $(document).on("click", "#delete-selected-group", function() {  //  add member for create group
            application.data.group.deleteGroup();
        });
        $(document).on("click", "#delete-selected-file", function() {  //  add member for create group
            var id=$(this).attr('data-fid');
            var cid=$(this).attr('data-fcdid');
            application.data.file.deleteFile(id,cid);
        });
        $(document).on("change", "#permission-member-add", function() {  //  add member permission changed
           var liobj= $(this).parent().parent();
           var email=liobj.children("#member-email-add").text();        
           var per=liobj.find("#permission-member-add").find(":selected").attr("value");
           application.data.group.addMemberPermissionChanger(email,per);
        });
        $(document).on("change", "#permission-member-update", function() {  //  add member permission changed
           var liobj= $(this).parent().parent();
           var email=liobj.children("#member-email-update").text();        
           var per=liobj.find("#permission-member-update").find(":selected").attr("value");
           application.data.group.updateMemberPermissionChanger(email,per);
        });
        $(document).on("click", "#member-remove-add", function() {  //  add member - member removed
           var liobj= $(this).parent();
           var email=liobj.children("#member-email-add").text();        
           var per=liobj.find("#permission-member-add").find(":selected").attr("value");
           var check=application.data.group.addMemberUnInvite(email,per);
           if(check==true){
               liobj.remove();
           }
        });
        $(document).on("click", "#member-remove-update", function() {  //  add member - member removed
           var liobj= $(this).parent();
           var email=liobj.children("#member-email-update").text();        
           var per=liobj.find("#permission-member-update").find(":selected").attr("value");
           var check=application.data.group.updateMemberUnInvite(email,per);
           if(check==true){
               liobj.remove();
           }
        }); 
        $(document).on("click", "#acceptGroupRequest", function(e) {  //  add member - member removed
           //alert($(this).attr("data-groupId"));
           application.data.group.userResponceToGroupRequest($(this).attr("data-groupId"), "1");
            $( e.target ).closest( "a" ).remove();
        });
        $(document).on("click", "#declineGroupRequest", function(e) {  //  add member - member removed
            application.data.group.userResponceToGroupRequest($(this).attr("data-groupId"), "0");
             $( e.target ).closest( "a" ).remove();
        });
        $(document).on("click", "#leave-group-button", function(e) {  //  leave group button click
//            application.data.group.userResponceToGroupRequest($(this).attr("data-groupId"), "0");
//             $( e.target ).closest( "a" ).remove();
                var group=selectedGroup;
                if(group.project_group_created_user_id==UserDetail.user_id){
                    var per=$(this).parent().find("#change-owner-select").find(":selected").attr("value");
                 //   alert(per);
                    application.data.group.leaveGroup(per);
                }else{
                    application.data.group.leaveGroup(null);
                }
                
            
        });
        $(document).on("click", "#group-save_btn", function() {  //  create new group cmmand
           $("#AddGroupDangeralert").hide();
           var name=$("#group-name-add").val();
           var desc=$("#group-desc-add").val();
           if(name==""){
               $("#group-name-add").notify("please Enter group name","error");
               return;
           }
           if(desc==""){
               $("#group-desc-add").notify("please Enter group description","error");
               return;
           }
           application.data.group.createNewGroup(name,desc);
           
        });
        $(document).on("click", "#group-update_btn", function() {  //  create new group cmmand
           $("#updateGroupDangeralert").hide();
           var name=$("#group-name-update").val();
           var desc=$("#group-desc-update").val();
           if(name==""){
               $("#group-name-update").notify("please Enter group name","error");
               return;
           }
           if(desc==""){
               $("#group-desc-update").notify("please Enter group description","error");
               return;
           }
           application.data.group.updateGroup(name,desc);
           
        });
        
        //--------------- search ----------------//
                //$("#search-snip-name").val("");
       // $("#snipLanSearch").selectpicker('val', "all");
         $(document).on("click", "#view-all-snip", function() {  //  senippet list item clcked
             $(this).addClass('btn-default');
            $(this).siblings().removeClass('btn-default');
             searchType="0";
             application.data.setUPsnipeets();
        });
        $(document).on("click", "#view-public-snip", function() {  //  senippet list item clcked
            $(this).addClass('btn-default');
            $(this).siblings().removeClass('btn-default');
            searchType="1";
            application.data.setUPsnipeets();
        });
         $(document).on("click", "#view-private-snip", function() {  //  senippet list item clcked
             $(this).addClass('btn-default');
            $(this).siblings().removeClass('btn-default');
           searchType="2";
           application.data.setUPsnipeets();
        });
        $(document).on("click","#backup-btn",function(){
            application.data.backuprestore.downloadBackup();
        });
        $(document).on("click","#snip-backup",function(){
            application.data.backuprestore.downloadSnipBackup();
        });
        $(document).on("click", "#view-all-codes", function() {  //  senippet list item clcked
           application.data.resetSearchVariables();
           $(".label-list-container li[class='selected-label']").removeClass('selected-label');
           $(this).addClass('selected-label');
           application.data.setUPsnipeets();
        });
        $(document).on("click","#view-versions",function(){
           $(".snippet-version-containor").empty();
           application.data.snippet.loadVersions();
        });
        $(document).on("change", "#snipLanSearch", function() {  //  senippet list item clcked
          searchLan=$(this).val();
          application.data.setUPsnipeets();
        });
        $(document).on("keyup", "#search-snip-name", function() {  //  senippet list item clcked
          searchName=$(this).val();
          application.data.setUPsnipeets();
        });
        $(document).on("click","button[data-dismiss='popover-cancel']",function(){
          $(".popover").remove();
        });
        $(document).on("click", ".label-list-container li", function(event) {  //  senippet list item clcked

            if(event.target.id=="editLabelPopover"){

                return;
            }
           $(this).addClass('selected-label');
           $("#view-all-codes").removeClass('selected-label');
            $(this).siblings().removeClass('selected-label');
            var id=$(this).attr("data-id");
            var cid=$(this).attr("data-lcdid");
            if(id=="no" && cid=="no"){
                searchLabel="no";
            }else{
                searchLabel=Labels[id][cid];
            }            
            application.data.setUPsnipeets();
        });
        
        $(document).on("submit","#add-file-form",function(e){
              e.preventDefault(); //Prevent Default action.               
                 application.data.file.uploadFile(this);                
              
        });
         $(document).on("submit","#upload-backup-form",function(e){
              e.preventDefault(); //Prevent Default action.               
                 application.data.backuprestore.uploadBackup(this);                
              
        });
        
        $("#toggle").on("click", function() {
                $(".row-offcanvas").toggleClass("active");
            });
            $("#public-private-view").bootstrapSwitch();
            
            $("#code-toggle1").on("click", function() {
                $("#file-code1").toggle();
                $("#code-toggle1").toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
            });
            
            $("#code-toggle2").on("click", function() {
                $("#file-code2").toggle();
                $("#code-toggle2").toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
            });
            
            
            
            $("#cancel-edit").on("click", function() {
                $("#snippet-details").show();
                $("#snippet-details-edit").hide();
                 $(".snippet-version-containor").hide();
            });
            
            $("#language").click(function() {         
                 $("#lang-list").toggle();
             });
             
        //-------------------------------------//
        //copy to clip
          var client = new ZeroClipboard( document.getElementById("copy-to-clipbord"), {
            moviePath: application.config.getBasePath()+ "assets/lib/zeroclipboard/ZeroClipboard.swf",debug: false
          });
            client.on( 'load', function(client) { 
              client.on( 'datarequested', function(client) {
                var text = editorView.getValue();
                client.setText(text);
                $.notify("Snippet successfully copied to clipboard", "success");
              }); 
              // callback triggered on successful copying
              client.on( 'complete', function(client, args) {
                console.log("Text copied to clipboard: \n" + args.text );
              });
            }); 
            // In case of error - such as Flash not being available
            client.on( 'wrongflash noflash', function() {
              ZeroClipboard.destroy();
            });
            
    }

}



