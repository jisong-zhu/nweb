'use strict';
const File = require('fs');
const Fetch = require('node-fetch');

class FileEnc {
    constructor() {
        this.proj = {
            APIKey: 'ZTUyYTY5MmMtZTg1Zi00NTNmLWFiMmItOGI0YzYzZDJkY2VjOjYzNTc1OTg4ODM0MTQ5NjM4Ng==',
            APIPwd: 'YzBmNWU4YTgtNjY1Mi00NTlkLTg3Y2EtNmUyZjE5OTcyY2I3',
            Name: 'obfuscate walnut client',
            ReplaceNames: true,
            EncodeStrings: true,
            SelfCompression: true,
            CompressionRatio: 'Auto',
            MoveStrings: true,
            MoveMembers: true,
            EncryptStrings: true,
            DeepObfuscate: true,
            Items: []
        };
    }
    add(filename) {
        let item = {
            FileName: filename,
            FileCode: File.readFileSync(filename, 'utf8')
        };
        this.proj.Items.push(item);
        return this;
    }
    addFiles(files) {
        for (let filename of files) {
            this.add(filename);
        }
        return this;
    }
    enc() {
        if (this.proj.Items.length <= 0) {
            return;
        }
        // for more parameters of the proj object , please reference
        //       http://service.javascriptobfuscator.com/httpapi.asmx?WSDL
        let url = 'https://service.javascriptobfuscator.com/HttpApi.ashx';
        Fetch('https://service.javascriptobfuscator.com/HttpApi.ashx', {
                method: 'post',
                headers: {
                    'Content-Type': 'text/json'
                },
                body: JSON.stringify(this.proj)
            })
            .then(res => {
                switch (res.status) {
                    case 200:
                        return res.json();
                    default:
                        return Promise.reject({
                            code: res.status,
                            text: res.statusText
                        });
                }
            }).then(encrypted => {
                if (encrypted && encrypted.Type === 'Succeed') {
                    for (let item of encrypted.Items) {
                        let stat = File.statSync(item.FileName);
                        File.writeFileSync(item.FileName, item.FileCode, 'utf8');
                        console.log(`${item.FileName} : ${parseInt(stat.size/1000)}KB => ${parseInt(item.FileCode.length/1000)}KB`);
                    }
                } else {
                    console.log('加密文件失败');
                    console.log(encrypted);
                }
            }).catch(err => {
                console.log(err);
            });
    }
}

module.exports = FileEnc;
