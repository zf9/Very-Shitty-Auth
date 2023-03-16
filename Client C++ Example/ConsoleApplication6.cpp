#include <iostream>
#include <windows.h>
#include "wnetwrap.h"
int main();
std::string LoggedIn_UUID;
std::string LoggedIn_Username;
#include "Header.h"

int option;
std::string username;
std::string password;




int main() {
	SetConsoleTitleA("Bozo");
	system("cls");
	std::cout << "\n\n   1) Login\n   2) Register\n   Option: ";
	std::cin >> option;

	if (option == 1) {

		system("cls");
		std::cout << "\n\n   Username: ";
		std::cin >> username;
		std::cout << "   Password: ";
		std::cin >> password;
		SetConsoleTitleA("Bozo | Connecting...");
		wrap::Response r = wrap::HttpsRequest(wrap::Url{ "https://HauntingMisguidedQuadrant.kyzs.repl.co/login/?login=" + username + ":" + password });
		StatusCode(r.status_code);
		Responce(r.text);


	}
	else if (option == 2) {
		system("cls");
		std::cout << "\n\n   Username: ";
		std::cin >> username;
		std::cout << "   Password: ";
		std::cin >> password;
		SetConsoleTitleA("Bozo | Connecting...");
		wrap::Response r = wrap::HttpsRequest(wrap::Url{ "https://HauntingMisguidedQuadrant.kyzs.repl.co/register/?register=" + username + ":" + password });
		StatusCode(r.status_code);
		Responce(r.text);
	}
	else {
		system("cls");
		std::cout << "Invalid Option." << std::endl;
		Sleep(2500);
		exit(69);
	}
}