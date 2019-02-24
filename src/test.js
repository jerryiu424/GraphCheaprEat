var userCount;

for (userCount = 0; userCount < 5; userCount++){
    var faker = require('faker');
    var name = faker.name.findName();
    var email = faker.internet.email();
    var phone = faker.phone.phoneNumberFormat(2).replace('-',"").replace('-',"").replace('-',"");
    console.log(name + " | " + email + " | " + phone);
}