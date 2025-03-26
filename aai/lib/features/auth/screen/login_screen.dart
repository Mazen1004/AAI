import 'package:aai/core/common/sign_in_button.dart';
import 'package:aai/core/constants/constants.dart';
import 'package:aai/theme/pallete.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen ({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset(
          Constants.logoPath,
          height: 50,
          ),
      ),
      body: Column(
        children: [
          const SizedBox(height: 30),
          const Text('Identify your Artifact!', 
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 30),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Image.asset(
              Constants.loginEmotePath,
              height: 400,
            ),
          ),
          const SizedBox(height: 20),
          const SignInButton(),
        ],
      ),
    );
  }
}