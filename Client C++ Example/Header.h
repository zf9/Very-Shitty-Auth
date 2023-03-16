#pragma once
std::vector<std::string> splitString(std::string str, char splitter) {
	std::vector<std::string> result;
	std::string current = "";
	for (int i = 0; i < str.size(); i++) {
		if (str[i] == splitter) {
			if (current != "") {
				result.push_back(current);
				current = "";
			}
			continue;
		}
		current += str[i];
	}
	if (current.size() != 0)
		result.push_back(current);
	return result;
}


void StatusCode(std::string statuscode) {
	if (statuscode == "200") {
		SetConsoleTitleA("Bozo | Connected!");
	}
	else {
		SetConsoleTitleA("Bozo | Connection Failed.");
		exit(99);
	}
}

void Responce(std::string responce)
{
	if (responce == "404") {
		system("cls");
		std::cout << "\n\n   Unknown Error." << std::endl;
		Sleep(2500);
		exit(69);
	}
	else if (responce == "invalid_password") {
		std::cout << "\n   Invalid Password Provided." << std::endl;
		Sleep(2500);
		main();
	}
	else if (responce == "invalid_username") {
		std::cout << "\n   Invalid username Provided." << std::endl;
		Sleep(2500);
		main();
	}
	else if (responce == "username_exist") {
		std::cout << "\n   Username Provided Already Exist." << std::endl;
		Sleep(2500);
		main();
	}
	else
	{
		std::string s2 = "el";
		if (strstr(responce.c_str(), "UUID_")) {
			std::vector<std::string> result = splitString(responce.c_str(), ':');
			LoggedIn_UUID = result[0];
			LoggedIn_Username = result[1];
			std::string TitleBar = "Bozo | Logged In As : " + LoggedIn_Username;
			SetConsoleTitleA(TitleBar.c_str());

		}
		else
		{
			system("cls");
			std::cout << "\n\n   Unknown Error." << std::endl;
			Sleep(2500);
			exit(69);
		}

	}
}