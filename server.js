const express = require('express');
const cors = require('cors');
const app = express();
const { ObjectId } = require('mongodb');
const Inventory = require('./collection/Data')
const Accounts = require('./collection/Account')
const ExpencesData = require('./collection/ExpencesData')
const RecordsDb = require('./collection/Records')


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('connected');
});

app.post('/SendData', async (req, res) => {
    const { userName, Position, Expences,  data, date, Uid } = req.body

    try {
        const sendData = new Inventory({
            userName: userName,
            Position: Position,
            Expences: Expences,
            data: data,
            date: date,
            Uid: Uid
        })
        await sendData.save()
        res.status(201).json({ message: 'Inventory created successfully' });
    } catch (err) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Error creating report' });
    }
});

app.get('/GetData', async (req, res) => {
    Inventory.find()
        .then((data) => {
            res.json(data)
        }).catch((err) => {
            console.log(err)
        })
})

app.put('/update/:tableID/:index', async (req, res) => {
    const { tableID, index } = req.params;
    const { riceName, pricePerKilo, productSold } = req.body;
    try {
        // Construct the update object for the specific index
        const updateObject = {
            [`data.${index}.riceName`]: riceName,
            [`data.${index}.pricePerKilo`]: pricePerKilo,
            [`data.${index}.productSold`]: productSold
        };

        // Update the document in the database
        const result = await Inventory.findByIdAndUpdate(tableID, {
            $set: updateObject,
        });

        if (!result) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/updateEx/:tableID/:index', async (req, res) => {
    const { tableID, index } = req.params;
    const { expence, expenceVal } = req.body;
    try {
        // Construct the update object for the specific index
        const updateObject = {
            [`Expences.${index}.expence`]: expence,
            [`Expences.${index}.expenceVal`]: expenceVal,

        };

        // Update the document in the database
        const result = await Inventory.findByIdAndUpdate(tableID, {
            $set: updateObject,
        });

        if (!result) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});













app.delete('/updateEx/:tableID/:index', async (req, res) => {
    const { tableID, index } = req.params;
    try {
        // Convert index to integer
        const dataIndex = parseInt(index);

        // Update the document to remove the element at the specified index
        const result = await Inventory.updateOne(
            { _id: tableID }, // Find document by ID
            {
                $unset: {
                    [`Expences.${dataIndex}`]: ""
                }
            }
        );

        // Remove null elements from the Expences array
        await Inventory.updateOne(
            { _id: tableID },
            { $pull: { Expences: null } }
        );
        
        

        // Check if the update operation was successful
        if (result.modifiedCount === 1) {
            res.send("Document updated successfully");
        } else {
            res.status(404).send("Document not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

















app.delete('/delete/:tableID/:index', async (req, res) => {
    const { tableID, index } = req.params;
    try {
        // Convert index to integer
        const dataIndex = parseInt(index);

        // Update the document to remove the element at the specified index
        const result = await Inventory.updateOne(
            { _id: tableID }, // Find document by ID
            {
                $unset: {
                    [`data.${dataIndex}`]: ""
                }
            }
        );
        // Remove any null elements left after the unset operation
        await Inventory.updateOne(
            { _id: tableID },
            { $pull: { data: null } }
        );

        // Check if the data array is empty after removal
        const updatedDoc = await Inventory.findById(tableID);
        if (updatedDoc.data.length === 0) {
            // If data array is empty, delete the entire document
            await Inventory.deleteOne({ _id: tableID });
        }

        // Check if the update operation was successful
        if (result.modifiedCount === 1) {
            res.send("Document updated successfully");
        } else {
            res.status(404).send("Document not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});




app.post('/SendAcc', async (req, res) => {
    const { Email, Username, Sex, Password, Position, Uid } = req.body
    try {
        console.log(Username, Position)
        const sendData = new Accounts({
            Username: Username,
            Sex: Sex,
            Email: Email,
            Password: Password,
            Position: Position,
            Uid: Uid
        })
        await sendData.save()
        res.status(201).json({ message: 'Inventory created successfully' });
    } catch (err) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Error creating report' });
    }
});





app.post('/SendExpences', async (req, res) => {
    const { userName, Position, data, date, Uid } = req.body

    try {
        const sendData = new ExpencesData({
            userName: userName,
            Position: Position,
            data: data,
            date: date,
            Uid: Uid
        })
        await sendData.save()
        res.status(201).json({ message: 'Inventory created successfully' });
    } catch (err) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Error creating report' });
    }
});


app.get('/GetExpences', async (req, res) => {
    ExpencesData.find()
        .then((data) => {
            res.json(data)
        }).catch((err) => {
            console.log(err)
        })
})





app.get('/GetAcc', async (req, res) => {
    Accounts.find()
        .then((data) => {
            res.json(data)
        }).catch((err) => {
            console.log(err)
        })
})




//records endpoints

app.post('/SendRecord', async (req, res) => {
    const { userName, Position,  data, date, Uid } = req.body

    try {
        const sendData = new RecordsDb({
            userName: userName,
            Position: Position,
            data: data,
            date: date,
            Uid: Uid
        })
        await sendData.save()
        res.status(201).json({ message: 'Inventory created successfully' });
    } catch (err) {
        console.error('Error creating report:', err);
        res.status(500).json({ error: 'Error creating report' });
    }
});

app.get('/GetRecords', async (req, res) => {
    RecordsDb.find()
    .then((data) => {
        res.json(data)
    }).catch((err) => {
        console.log(err)
    })
})

app.put('/updateRec/:tableID/:index', async (req, res) => {
    const { tableID, index } = req.params;
    const { riceProd, Stocks, Price, StocksUsed, Supplier, ContactNum, DatePur, DateStock,  } = req.body;
    try {
        // Construct the update object for the specific index
        const updateObject = {
            [`data.${index}.riceProd`]: riceProd,
            [`data.${index}.Stocks`]: Stocks,
            [`data.${index}.Price`]: Price,
            [`data.${index}.StocksUsed`]: StocksUsed,
            [`data.${index}.Supplier`]: Supplier,
            [`data.${index}.ContactNum`]: ContactNum,
            [`data.${index}.DatePur`]: DatePur,
            [`data.${index}.DateStock`]: DateStock,
        };

        // Update the document in the database
        const result = await RecordsDb.findByIdAndUpdate(tableID, {
            $set: updateObject,
        });

        if (!result) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.delete('/updateRec/:tableID/:index', async (req, res) => {
    const { tableID, index } = req.params;
    try {
        // Convert index to integer
        const dataIndex = parseInt(index);
        // Update the document to remove the element at the specified index
        const result = await RecordsDb.updateOne(
            { _id: tableID }, // Find document by ID
            {
                $unset: {
                    [`data.${dataIndex}`]: 1 // Use 1 to unset the field
                }
            }
        );
        // Remove null elements from the data array
        await RecordsDb.updateOne(
            { _id: tableID },
            { $pull: { data: null } }
        );

        const record = await RecordsDb.findOne({ _id: tableID });
        if (record && record.data && record.data.length === 0) {
            // If data array is empty, delete the document
            await RecordsDb.deleteOne({ _id: tableID });
            res.send("Document deleted successfully");
            return;
        }

        // Check if the update operation was successful
        if (result.modifiedCount === 1) {
            res.send("Document updated successfully");
        } else {
            res.status(404).send("Document not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});


app.listen(8080, () => {
    console.log('server started');
});
