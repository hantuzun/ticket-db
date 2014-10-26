# the interface between node.js and frontend


@@@ basic actions
everyone can perform these actions 
### list artists / venues / events
### list X by filtering Y, Z, ...
#### get details of an artist
### get details of an event


@@@ admin actions (only admin users can perform these actions)
>> list actions
#### list users
#### list tickets
>> add actions
#### add artist
### add venue
### add event
>>> delete actions
### delete artist
### delete venue
### delete event
### delete user


@@@ customer actions (only logged in customers can perform these actions)
#### purchase a ticket
#### list purchased tickets
#### delete account
#### log out


@@@ guest actions (only not logged in users can perform these actions)
#### register