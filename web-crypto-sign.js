function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

async function createKey()
{
    let keyPair = await window.crypto.subtle.generateKey(
        {
          name: "ECDSA",
          namedCurve: "P-384"
        },
        true,
        ["sign", "verify"]
      );
    
    const exported = await window.crypto.subtle.exportKey( "pkcs8", keyPair.privateKey);
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    console.log (JSON.stringify(exportedAsBase64, null, " "))
    document.getElementById('password').value = exportedAsBase64; 
    document.getElementById('form').style.display ='block'; 
}

async function sign()
{
    const pemContents = document.getElementById('password').value
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);
    const privateKey =  await window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
            name: "ECDSA",
            namedCurve: "P-384"
        },
        true,
        ["sign"]
    ); 

    const textToSign = document.getElementById('textToSign').value
    let encoded = new TextEncoder().encode(textToSign);
    let signature = await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: {name: "SHA-384"},
      },
      privateKey,
      encoded
    );
    signatureArray = new Uint8Array(signature)
    document.getElementById('signature').innerHTML =  btoa(String.fromCharCode.apply(null,signatureArray))
}