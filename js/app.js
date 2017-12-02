/*
 * Author: rayxgdev (Manuel Rodriguez Gil)
 * Date: 2017-12-02
 * File: app.js
 * Description: Main js for Email Composer
 */

/*
 * Listeners to file upload
 */
$("#butFile").change(function () {
    if (this.files.length > 0 && !window.document.getElementById('divAttached'))
        showLblAttached();
    for (var i = 0; i < this.files.length; i++)
        if (!window.document.getElementById(this.files[i].name))
            createThumbnail(this.files[i]);
    $('.divThumbnail').click(function (e) {
        if (this.previewElement !== null)
            this.parentNode.removeChild(this);
        this.previewElement = null;
        checkAttached();
    });
});

/*
 * Listeners to validate all text fields
 */
window.document.getElementById('txtTo').addEventListener('keyup', validateData);
window.document.getElementById('txtTo').addEventListener('mouseup', validateData);
window.document.getElementById('txtCC').addEventListener('keyup', validateData);
window.document.getElementById('txtBCC').addEventListener('keyup', validateData);
window.document.getElementById('txtSubject').addEventListener('keyup', validateData);
window.document.getElementById('txtMessage').addEventListener('keyup', validateData);


/*
 * Name: createThumbnail
 * Parameters: file (FileList item)
 * Description: Used to create thumbnail html for each image uploaded
 * Return: void
 */
function createThumbnail(file) {
    var thumbnailsContainer = window.document.getElementById('thumbnailsContainer');
    var divThumbnail = window.document.createElement('div');
    divThumbnail.setAttribute('class', 'divThumbnail');
    divThumbnail.setAttribute('id', file.name);
    thumbnailsContainer.appendChild(divThumbnail);
    var img = window.document.createElement('img');
    img.setAttribute('class', 'thumbnail');
    img.setAttribute('alt', file.name);
    img.setAttribute('src', window.URL.createObjectURL(file));
    divThumbnail.appendChild(img);
    var remove = window.document.createElement('div');
    remove.setAttribute('class', 'remove');
    divThumbnail.appendChild(remove);
    var iGlyph = window.document.createElement('i');
    iGlyph.setAttribute('class', 'glyphicon glyphicon-trash');
    remove.appendChild(iGlyph);
}

/*
 * Name: showLblAttached
 * Description: Create and show label "Attached files"
 * Return: void
 */
function showLblAttached() {
    var thumbnailsContainer = window.document.getElementById('thumbnailsContainer');
    var divAttached = window.document.createElement('div');
    divAttached.setAttribute('id', 'divAttached');
    thumbnailsContainer.appendChild(divAttached);
    var lblAttached = window.document.createElement('label');
    lblAttached.innerHTML = 'Attached files';
    divAttached.appendChild(lblAttached);
}

/*
 * Name: checkAttached
 * Description: Removes "Attached files" label if no images left
 * Return: void
 */
function checkAttached() {
    var divAttached = window.document.getElementById('divAttached');
    var butFile = window.document.getElementById('butFile');
    if ($('.divThumbnail').length === 0 && divAttached !== null) {
        divAttached.parentNode.removeChild(divAttached);
        butFile.value = "";
    }
}

/*
 * Name: validateEmail
 * Parameter: email (string)
 * Description: RegEx to validate emails
 * Return: boolean true | false
 */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/*
 * Name: validateEmail
 * Parameter: value (string)
 * Description: Divides by commas all emails in recipient text and then validates
 * Return: boolean true | false
 */
function validateMultipleEmails(value) {
    var result = value.replace(/\s/g, '').split(",");
    for (var i = 0; i < result.length; i++)
        if (!validateEmail(result[i]))
            return false;
    return true;
}

/*
 * Name: validateData
 * Description: Main function of the app. Validates and check all text fields to activate or disable "Send" button
 * Return: void
 */
function validateData() {
    var butSend = window.document.getElementById('butSend');
    var txtTo = window.document.getElementById('txtTo');
    var txtCC = window.document.getElementById('txtCC');
    var txtBCC = window.document.getElementById('txtBCC');
    var txtSubject = window.document.getElementById('txtSubject');
    var txtMessage = window.document.getElementById('txtMessage');
    var isValidTo = validateRecipient(txtTo);
    var isValidCC = validateRecipient(txtCC);
    var isValidBCC = validateRecipient(txtBCC);
    var isValidSubject = validateSubject(txtSubject);
    var validRecipient = false;

    if (isValidTo === 2 && isValidCC === 2 && isValidBCC === 2)
        validRecipient = false;
    else if (isValidTo !== 0 && isValidCC !== 0 && isValidBCC !== 0)
        validRecipient = true;
    else
        validRecipient = false;
    if (validRecipient && isValidSubject && txtMessage.value !== "")
        butSend.className = 'btn btn-info btnOval';
    else
        butSend.className = 'btn btn-default btnOval disabled';

}

/*
 * Name: validateRecipient
 * Parameter: field (element)
 * Description: Used to validate all recipient fields and show error or success
 * Return: int 0 | 1 | 2
 */
function validateRecipient(field) {
    if (field.value !== "" && !validateMultipleEmails(field.value)) {
        field.parentNode.className = 'col-sm-12 has-error';
        return 0;
    } else if (field.value === "") {
        field.parentNode.className = 'col-sm-12';
        return 2;
    } else {
        field.parentNode.className = 'col-sm-12 has-success';
        return 1;
    }
}

/*
 * Name: validateSubject
 * Parameter: subject (element)
 * Description: Used to validate subject field and show success or error if length is greater than 100
 * Return: boolean true | false
 */
function validateSubject(subject) {
    if (subject.value !== "" && subject.value.length <= 100) {
        subject.parentNode.className = 'col-sm-12';
        return true;
    } else if (subject.value === "") {
        subject.parentNode.className = 'col-sm-12';
        return false;
    } else {
        subject.parentNode.className = 'col-sm-12 has-error';
        return false;
    }
}