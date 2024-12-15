import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';  // Import the CSS file

// Contract address and ABI remain unchanged
const contractAddress = '0xf8e81D47203A594245E36C48e151709F0C19fBe8';
const contractABI = [ {
    "inputs": [
        {
            "internalType": "string",
            "name": "_ownerName",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "_documentHash",
            "type": "string"
        }
    ],
    "name": "addProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "ownerName",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "documentHash",
            "type": "string"
        }
    ],
    "name": "PropertyAdded",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }
    ],
    "name": "PropertyVerified",
    "type": "event"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
        }
    ],
    "name": "verifyProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
        }
    ],
    "name": "getProperty",
    "outputs": [
        {
            "components": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "ownerName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "documentHash",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "isVerified",
                    "type": "bool"
                }
            ],
            "internalType": "struct PropertyVerification.Property",
            "name": "",
            "type": "tuple"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "name": "properties",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "ownerName",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "documentHash",
            "type": "string"
        },
        {
            "internalType": "bool",
            "name": "isVerified",
            "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "propertyCount",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}];

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [ownerName, setOwnerName] = useState('');
    const [documentHash, setDocumentHash] = useState('');
    const [propertyId, setPropertyId] = useState('');
    const [propertyDetails, setPropertyDetails] = useState(null);

    // Initialize Web3 and Contract
    useEffect(() => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);

            const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
            setContract(contractInstance);

            window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
                setAccount(accounts[0]);
                console.log('Connected to MetaMask with account:', accounts[0]);
            }).catch(err => {
                console.error('Error connecting to MetaMask:', err);
            });
        } else {
            alert('Please install MetaMask!');
        }
    }, []);

    // Add Property
    const addProperty = async () => {
        if (!ownerName || !documentHash) {
            alert('Please fill in all fields!');
            return;
        }
        try {
            await contract.methods.addProperty(ownerName, documentHash).send({ from: account });
            alert('Property added successfully!');
        } catch (error) {
            console.error('Error adding property:', error);
            alert('Error adding property');
        }
    };

    // Verify Property
    const verifyProperty = async () => {
        if (!propertyId) {
            alert('Please enter a property ID!');
            return;
        }
        try {
            await contract.methods.verifyProperty(propertyId).send({ from: account });
            alert('Property verified successfully!');
        } catch (error) {
            console.error('Error verifying property:', error);
            alert('Error verifying property');
        }
    };

    // Get Property
    const getProperty = async () => {
        if (!propertyId) {
            alert('Please enter a property ID!');
            return;
        }
        try {
            const property = await contract.methods.getProperty(propertyId).call();
            setPropertyDetails(property);
        } catch (error) {
            console.error('Error getting property:', error);
            alert('Error getting property');
        }
    };

    return (
        <div className="app-container">
            <h2>Property Verification DApp</h2>

            <button className="connect-btn" onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
                Connect MetaMask
            </button>

            <div className="form-container">
                <h3>Add Property</h3>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Owner Name"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                />
                <input
                    className="input-field"
                    type="text"
                    placeholder="Document Hash"
                    value={documentHash}
                    onChange={e => setDocumentHash(e.target.value)}
                />
                <button className="action-btn" onClick={addProperty}>Add Property</button>
            </div>

            <div className="form-container">
                <h3>Verify Property</h3>
                <input
                    className="input-field"
                    type="number"
                    placeholder="Property ID"
                    value={propertyId}
                    onChange={e => setPropertyId(e.target.value)}
                />
                <button className="action-btn" onClick={verifyProperty}>Verify Property</button>
            </div>

            <div className="form-container">
                <h3>Get Property</h3>
                <input
                    className="input-field"
                    type="number"
                    placeholder="Property ID"
                    value={propertyId}
                    onChange={e => setPropertyId(e.target.value)}
                />
                <button className="action-btn" onClick={getProperty}>Get Property</button>
                {propertyDetails && (
                    <div className="property-details">
                        <h4>Property Details:</h4>
                        <p>ID: {propertyDetails.id}</p>
                        <p>Owner Name: {propertyDetails.ownerName}</p>
                        <p>Document Hash: {propertyDetails.documentHash}</p>
                        <p>Verified: {propertyDetails.isVerified ? 'Yes' : 'No'}</p>
                    </div>
                )}
            </div>

            <div className="form-container">
                <h3>Redirect to External Link</h3>
                <button
                    className="redirect-btn"
                    onClick={() => window.location.href = 'https://veerporwal.pythonanywhere.com/'}
                >
                    Go to External Link
                </button>
            </div>
        </div>
    );
};

export default App;
