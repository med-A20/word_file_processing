let {Document} = require('docxyz');


function changeFirstNumberAfterArticle(str, newNumber) {
    const regex = /(ARTICLE\s+)(\d+)/;
  
    const modifiedStr = str.replace(regex, (match, article, number) => {
    return article + newNumber;
    });
  
    return modifiedStr;
}

function handleOrder(fileName, lastNumber){
    let x = lastNumber
    let doc = new Document(fileName);
    for(t of doc.paragraphs){
            if (t.text.includes("ARTICLE")){
                    console.log("=========>",t.text, lastNumber)
                    t.text = changeFirstNumberAfterArticle(t.text, lastNumber)
                    lastNumber++
            }
    }

    doc.save(`./processed/doc-${x}.docx`) 
}

module.exports = handleOrder