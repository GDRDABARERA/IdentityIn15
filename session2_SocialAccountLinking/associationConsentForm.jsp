<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:directive.include file="../includes/init-url.jsp"/>
<div>
    <h2>
        We found an already registerd account with the email "<c:out value='${requestScope.data["email"]}'/>" do you want to link it?
    </h2>
</div>

<div class="boarder-all ">
    <div class="clearfix"></div>
    <div class="padding-double login-form">
        
        <form action="<%=commonauthURL%>" method="POST">
            <input type="hidden" id="decision" name="decision" value="yes">
            
            <input type="hidden" id="promptResp" name="promptResp" value="true">
            <input type="hidden" id="promptId" name="promptId" value="${requestScope.promptId}">
            <div>
                <input type="submit" value="Yes">
                <input type="submit" onclick="setDecisionNo();" value="No">
            </div>
        </form>
    </div>
</div>
<script> 
    var inputEl = document.getElementById("decision"); 
    function setDecisionNo() { 
        inputEl.value = "no";
    } 
</script> 