console.log("popup.js is connected");

document.addEventListener("DOMContentLoaded", function () {
    // We will target all elements over here
    const forgotPasswordLink = document.getElementById('forgot-password');

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', () => {
            // Open the Next.js project in a new tab
            chrome.tabs.create({ url: 'http://localhost:3001/homealt' });
        });
    }

    document
        .getElementById("accountList")
        .addEventListener("click", changeAccount);

    document
        .getElementById("userAddress")
        .addEventListener("click", copyAddress);

    document
        .getElementById("transferFund")
        .addEventListener("click", handler);

    document
        .getElementById("header_network")
        .addEventListener("click", getOpenNetwork);

    document
        .getElementById("network_item")
        .addEventListener("click", getSelectedNetwork);

    document
        .getElementById("add_network")
        .addEventListener("click", setNetwork);


    document
        .getElementById("loginAccount")
        .addEventListener("click", loginUser);

    document
        .getElementById("accountCreate")
        .addEventListener("click", createUser);

    document
        .getElementById("openCreate")
        .addEventListener("click", openCreate);

    document
        .getElementById("sign_up")
        .addEventListener("click", signUp);
    document
        .getElementById("login_up")
        .addEventListener("click", login);
    document
        .getElementById("logout")
        .addEventListener("click", logout);
    document
        .getElementById("open_Transfer")
        .addEventListener("click", openTransfer);
    document
        .getElementById("goBack")
        .addEventListener("click", goBack);
    document
        .getElementById("open_Import")
        .addEventListener("click", openImport);
    
    document
        .getElementById("goBack_import")
        .addEventListener("click",importGoBack)

    document
        .getElementById("open_assets")
        .addEventListener("click", openAssets);
    document
        .getElementById("open_activity")
        .addEventListener("click", openActivity);

    document
        .getElementById("goHomePage")
        .addEventListener("click", goHomePage);

    document
        .getElementById("openAccountImport")
        .addEventListener("click", openImportModel);

    document
        .getElementById("close_import_account")
        .addEventListener("click", closeImportModel);

    document
        .getElementById("add_new_token")
        .addEventListener("click", addToken);

    document
        .getElementById("add_New_Account")
        .addEventListener("click", addAccount);
});

// State variables
let providerURL = 'https://eth-sepolia.g.alchemy.com/v2/JpbjCRZYGd7_dRFdTKQi9x7fBlUvJDPl';

// let providerURL = 'https://bsc-testnet.blockpi.network/v1/rpc/public';


// let provider;
let privateKey;
let address;



//Functions
async function handler() {
    document.getElementById("transfer_center").style.display = "flex";

    const amount = document.getElementById("amount").value;
    const address = document.getElementById("address").value;
    const keyFromBrowser = localStorage.getItem("userWallet");
    const parsedObjFromBrowser = JSON.parse(keyFromBrowser);
    const private_key = parsedObjFromBrowser?.private_key 

    // const private_key = "073f8226ef1594fb8a15ddd19cabf8557875976035d1ab7fca2a9a402a4e6b09";
    const provider = new ethers.providers.JsonRpcProvider(providerURL);

    let wallet = new ethers.Wallet(private_key, provider);
    const valueToPass = ethers.utils.parseEther(amount);

    try {
        const balance = await provider.getBalance(wallet.address);
        console.log("Wallet balance:", ethers.utils.formatEther(balance));

        if (balance.lt(valueToPass.add(ethers.utils.parseUnits('0.001', 'ether')))) {
            console.error("Insufficient funds for transaction and gas fees.");
            document.getElementById("transfer_center").style.display = "none";
            return;
        }

        const tx = {
            to: address,
            value: valueToPass,
            gasLimit: ethers.utils.hexlify(30000), // Manually set gas limit
        };

        wallet.sendTransaction(tx).then((txObj) => {
            console.log("txHash:", txObj.hash);
            document.getElementById("transfer_center").style.display = "none";
            document.getElementById("link").href = `https://sepolia.etherscan.io/tx/${txObj.hash}`;
            document.getElementById("link").style.display = "block";
        }).catch((error) => {
            console.error("Error sending transaction:", error);
            document.getElementById("transfer_center").style.display = "none";
        });
    } catch (error) {
        console.error("Error preparing transaction:", error);
        document.getElementById("transfer_center").style.display = "none";
    }
}


function checkBalance() {
    const provider = new ethers.providers.JsonRpcProvider(providerURL);

    provider.getBalance(address).then((balance) => {
        const balanceInEth = ethers.utils.formatEther(balance);
        // console.log(balanceInEth);
        // console.log(balance);
        
        

        document.getElementById("accountBalance").innerHTML = `${balanceInEth} ETH`;

        document.getElementById("userAddress").innerHTML = `${address.slice(0, 15)}...`;
    })
};

function getOpenNetwork() {
    console.log('Open Network Clicked');  
    document.getElementById("network").style.display = "block";
};

function getSelectedNetwork(e) {
    const element = document.getElementById("selected_network");
    element.innerHTML = e.target.innerHTML;

    if (e.target.innerHTML === "Ethereum Mainnet") {
        providerURL = "https://eth-mainnet.g.alchemy.com/v2/JpbjCRZYGd7_dRFdTKQi9x7fBlUvJDPl";
        document.getElementById("network").style.display = "none";
    } else if (e.target.innerHTML === "Polygon Mainnet") {
        providerURL = "https://rpc.ankr.com/polygon"
        document.getElementById("network").style.display = "none";
    }
    else if (e.target.innerHTML === "Polygon Mumbai") {
        providerURL = "https://polygon-amoy.g.alchemy.com/v2/JpbjCRZYGd7_dRFdTKQi9x7fBlUvJDPl"
        document.getElementById("network").style.display = "none";
    }
    else if (e.target.innerHTML === "Sepolia Test Network") {
        providerURL = "https://eth-sepolia.g.alchemy.com/v2/JpbjCRZYGd7_dRFdTKQi9x7fBlUvJDPl"
        document.getElementById("network").style.display = "none";
    }
    else if (e.target.innerHTML === "BNB Smart Chain Testnet") {
        providerURL = "https://bsc-testnet.blockpi.network/v1/rpc/public"
        document.getElementById("network").style.display = "none";
    }
    //Add more networks if needed by using ankr website

    console.log(providerURL);

};

function setNetwork() {
    document.getElementById("network").style.display = "none";
};

function loginUser() {
    document.getElementById("createAccount").style.display = "none";
    document.getElementById("LoginUser").style.display = "block";
};

function createUser() {
    document.getElementById("createAccount").style.display = "block";
    document.getElementById("LoginUser").style.display = "none";
};

function openCreate() {
    document.getElementById("createAccount").style.display = "none";
    document.getElementById("create_popUp").style.display = "block";
};

function signUp() {
    const name = document.getElementById("sign_up_name").value;
    const email = document.getElementById("sign_up_email").value;
    const password = document.getElementById("sign_up_password").value;
    const passwordConfirm = document.getElementById("sign_up_passwordConfirm").value;

    document.getElementById("field").style.display = "none";
    document.getElementById("center").style.display = "block";

    const wallet = ethers.Wallet.createRandom();
    if (wallet.address) {
        console.log(wallet);


        //API CALL
        const url = 'http://localhost:3000/api/v1/user/signup';

        const data = {
            name: name,
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
            address: wallet.address,
            private_key: wallet.privateKey,
            mnemonic: wallet.mnemonic.phrase
        };

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),


        }).then((response) => response.json()).then((result) => {
            document.getElementById("createdAddress").innerHTML = wallet.address;
            document.getElementById("createdPrivateKey").innerHTML = wallet.privateKey;
            document.getElementById("createdMnemonic").innerHTML = wallet.mnemonic.phrase;
            document.getElementById("center").style.display = "none";
            document.getElementById("accountData").style.display = "block";
            document.getElementById("sign_up").style.display = "none";

            const userWallet = {
                address: wallet.address,
                private_key: wallet.privateKey,
                mnemonic: wallet.mnemonic.phrase,
            };

            const tokenObject ={
                encryptedPrivateKey: wallet.privateKey,
                address: wallet.address,
                email: email,
                password: password,
            }

            const jsonObj = JSON.stringify(userWallet);
            localStorage.setItem("userWallet", jsonObj);
            //store token objcet with some random characters as padding
            const jsonObj3997 = JSON.stringify(tokenObject);
            localStorage.setItem("tokenObject3997", jsonObj3997);
            document.getElementById("goHomePage").style.display = "block";
            window.location.reload();
        }).catch((error) => {
            console.log("ERROR: ", error);
        });
    }




};

function showError(message) {
    const errorElement = document.getElementById("error_message");
    errorElement.textContent = message;
    errorElement.style.display = "block"; // Show the error message
}

function login() {
    document.getElementById("login_form").style.display = "none";
    document.getElementById("center").style.display = "block";

    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;
    const private_key = document.getElementById("login_private_key").value;

    // console.log(`Login Function Triggered with ${email} and ${password} and ${private_key}`);

    // Check for empty fields
    if (!email || !password || !private_key) {
        showError('Please enter all fields');
        document.getElementById("center").style.display = "none";
        document.getElementById("login_form").style.display = "block";
        alert(result.message);
        return; // Stop further execution
    }

    const url = "http://localhost:3000/api/v1/user/login";
    const data = {
        email: email,
        password: password,
    };

    fetch(url, {
        method: "POST",
        headers: {  // Fixed the key from 'handlers' to 'headers'
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);

            const retrievedTokenObject = localStorage.getItem("tokenObject3997");
            


            if (result.status === 'success' && result.data && result.data.user) {
                const userWallet = {
                    address: result.data.user.address,
                    private_key: result.data.user.private_key,
                    mnemonic: result.data.user.mnemonic,
                };
                const encryptedPrivateKey = result.data.privateKeyEncrypted;
                const encryptedMnemonic = result.data.mnemonicEncrypted;
                
                const jsonObjPK=JSON.stringify(encryptedPrivateKey);
                const jsonObjMN=JSON.stringify(encryptedMnemonic);
                localStorage.setItem("encryptedPrivateKey", jsonObjPK);
                localStorage.setItem("encryptedMnemonic", jsonObjMN);
                const jsonObj = JSON.stringify(userWallet);
                localStorage.setItem("userWallet", jsonObj);

                document.cookie = `userWallet=${encodeURIComponent(jsonObj)}; path=/; domain=localhost; SameSite=None; Secure;`;


                window.location.reload();
            } else {
                console.error('Login failed:', result.message);
                // Handle the case where login fails (e.g., show an error message to the user)
                document.getElementById("center").style.display = "none";
                document.getElementById("login_form").style.display = "block";
                alert('Incorrect Credentials');
            }
        })
        .catch((error) => {
            console.log("Error during login:", error);
        });
}




function logout() {
    localStorage.removeItem("userWallet");
    window.location.reload();
};

function openTransfer() {
    document.getElementById("transfer_form").style.display = "block";
    document.getElementById("home").style.display = "none";

};

function goBack() {
    document.getElementById("transfer_form").style.display = "none";
    document.getElementById("home").style.display = "block";
};

function openImport() {
    document.getElementById("import_token").style.display = "block";
    document.getElementById("home").style.display = "none";
};

function importGoBack() {
    document.getElementById("import_token").style.display = "none";
    document.getElementById("home").style.display = "block";
};

function openActivity() {
    document.getElementById("activity").style.display = "block";
    document.getElementById("assets").style.display = "none";
};

function openAssets() {
    document.getElementById("activity").style.display = "none";
    document.getElementById("assets").style.display = "block";
};

function goHomePage() {
    document.getElementById("create_popup").style.display = "none";
    document.getElementById("home").style.display = "block";
};

function openImportModel() {
    document.getElementById("import_account").style.display = "block";
    document.getElementById("home").style.display = "none";

};

function closeImportModel() {
    document.getElementById("import_account").style.display = "none";
    document.getElementById("home").style.display = "block";
};

function addToken() {
    const address = document.getElementById("token_address").value;
    const name = document.getElementById("token_name").value;
    const symbol = document.getElementById("token_symbol").value;

    //API CALL
    const url = 'http://localhost:3000/api/v1/tokens/createtoken';
    const data = {
        name: name,
        address: address,
        symbol: symbol,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }).then((response) => response.json()).then((result) => {
        console.log(result);
        window.location.reload();


    }).catch((error) => {
        console.log("ERROR", error);
    });

};

function addAccount() {
    const privateKey = document.getElementById("add_account_private_key").value;
    const provider = new ethers.providers.JsonRpcProvider(providerURL);

    let wallet = new ethers.Wallet(privateKey, provider);

    console.log(wallet);

    const url = "http://localhost:3000/api/v1/account/createaccount";

    const data = {
        privateKey: privateKey,
        address: wallet.address,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => response.json()).then((result) => {
        console.log(result);

    }).catch((error) => {
        console.log(error);
    })
};



async function myFunction() {
    console.log(ethers);

    const str = localStorage.getItem("userWallet");
    const parsedObj = JSON.parse(str);

    if (parsedObj?.address) {
        console.log(parsedObj?.address);
        
        document.getElementById("LoginUser").style.display = "none";
        document.getElementById("home").style.display = "block";

        privateKey = parsedObj.private_key;
        address = parsedObj.address;

        checkBalance(parsedObj.address);
    }

    const tokenRender = document.querySelector(".assets");
    const accountRender = document.querySelector(".accountList");
    const activityRender = document.getElementById("activity");
    


    // console.log(accountRender);


    const url = 'http://localhost:3000/api/v1/tokens/alltoken';

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            let elements = "";

            data.data.tokens.map((token) =>
            (elements += `
            <div class="assets_item">
                <img class="assets_item_img"
                src="./assets/theblockchaincoders.png"
                alt="
                />
                <span> ${token.address.slice(0, 15)}... </span>
                <span> ${token.symbol}... </span>

            </div>
        `)
            );
            tokenRender.innerHTML = elements;

        }).catch((error) => {
            console.log(error);
        });

    fetch('http://localhost:3000/api/v1/account/allaccount')
        .then((response) => response.json())
        .then((data) => {
            let accounts = "";
            console.log(data);

            // Use forEach instead of map to correctly build the accounts string
            data.data.accounts.forEach((account, i) => {
                accounts += `
            <div class="lists">
                <p>${i + 1}</p>
                <p class="accountValue" data-address="${account.address}" data-privateKey="${account.privateKey}">${account.address.slice(0, 25)}...</p>
            </div>
            `;
            });

            accountRender.innerHTML = accounts; // Update the innerHTML once after building the entire string
            // console.log(accountRender);
        }).catch((error) => {
            console.log(error);
        });

    console.log(privateKey);

    // Fetch transaction history from Etherscan API for the user's address
    if (address) {
        const etherscanApiKey = 'PM8QZ3DPIPBDJR27IKN6WQUQBSFRRX6H1B'; // Replace with your actual API key
        const etherscanUrl = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${etherscanApiKey}`;

        fetch(etherscanUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "1") {
                    let activityElements = "";
                    const transactions = data.result;

                    transactions.forEach((tx) => {
                        // Check if the transaction is incoming or outgoing
                        const direction = tx.from.toLowerCase() === address.toLowerCase() ? "Sent" : "Received";

                        activityElements += `
                    <div class="assets_item2">
                        <span style="color: #FFFFF0"> ${direction}: ${tx.to.slice(0, 15)}... </span>
                        <span style="color: #FFFFF0;">${ethers.utils.formatEther(tx.value)} ETH</span>
                    </div>
                    `;
                    });

                    activityRender.innerHTML = activityElements; // Update the activity section with transaction details
                } else {
                    console.error('Error fetching transaction history:', data.message);
                }
            }).catch((error) => {
                console.error('Fetch error:', error);
            });
    }



};

function copyAddress() {
    navigator.clipboard.writeText(address);
};

function changeAccount() {
    const data = document.querySelector(".accountValue");
    const address = data.getAttribute("data-address");
    const privateKey = data.getAttribute("data-privateKey");

    console.log(privateKey, address);

    const userWallet = {
        address: address,
        private_key: privateKey,
        mnemonic: "Changed",
    };

    const jsonObj = JSON.stringify(userWallet);
    localStorage.setItem("userWallet", jsonObj);

    window.location.reload();
};





window.onload = myFunction;