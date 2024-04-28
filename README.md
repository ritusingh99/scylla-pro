# scylla-pro

multiple dices ---> same port ---> deviceProfile ( mulitple ports can use the same device profile but same device profile cannot use multiple ports )

once a connection is made the data will satrt coming to that particluar device and aat
the device lebel need tosave the tdata for the particular device

1. Need to create the device profile so as the make the connection and start getting data on that port and send the downstream data ,
   2 . need to check that tehe port should not be already in use .

23-4-2024

1. each conenction created is mapped to a conection i d and the socket is subscribed using the redis subscribe model
2. when we need to send data the data is sent using the redis publish model .

to do --->

make them go througth a function -->
