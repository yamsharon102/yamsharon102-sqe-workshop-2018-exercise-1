import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        makeTableHTML(parseCode(codeToParse));
    });
});

const makeTableHTML = (myArray) => {
    let result = '<table border=1 class="myClass">';
    result += '<td>'+'Line'+'<td>'+'Type'+'<td>'+'Name'+'<td>'+'Condition'+'<td>'+'Value'+'</tr>';
    for(let i=0; i<myArray.length; i++) {
        result += '<tr>';
        let tmp = Object.keys(myArray[i]);
        for(let j=0; j<tmp.length; j++){
            result += '<td>'+myArray[i][tmp[j]]+'</td>';
        }
        result += '</tr>';
    }
    result += '</table>';

    document.body.innerHTML = result;
};