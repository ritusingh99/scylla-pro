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

make them go througth a function --> completed

29-04-24 --> divide them in sub parts and do the needfull

make common funciton to save data of a particlaur device in our data base

1 - checkk waht optimiesed data base to use and what table and how to save all the fields

2 - make common fucntion to be used while daving them

3 - maek classes witha bstraction whcih are not accesble from out side ( similar to result , upstream )

4 - make downstream jsut like clinet publish

5 - last updated ( similar t result.touch )

6 - check the session.client id with client .terminal id to check for which device we need to save the data for , which client id created by us equal to the
the device id used by the user

3 may 2024

create a device: DOne

create a device profile : DOne

create a conenction profile : DOne

create services attached to device profiles

create a json of variables attached to a connnection profile and device profile , along with there types : TBD

TODO poc

The thing that happens right now is the data comes to tc server and is passed through the device profile , psot the it can be stored directly or furthur modifications can be done for each device ---> how toa cheive furthur modifications --> the data should again be sebnt for modifications at device level , need to a lamba accumulator types the so where we can write teh custom cude fort hose modifiactions and save it there .

Need to do POC on teh changes accumulator\\

Need to do right now

till then we will be savinf teh data directly in teh device data along with the devcie if that exists in teh device table in teh seiion id key which teh =user utself cerates .

POSt that we will create for http
