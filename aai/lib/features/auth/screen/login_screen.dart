import 'package:aai/core/common/sign_in_button.dart';
import 'package:aai/core/constants/constants.dart';
import 'package:aai/features/auth/controller/auth_controller.dart';
import 'package:aai/theme/pallete.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:aai/core/common/loader.dart';

class LoginScreen extends ConsumerWidget {
  const LoginScreen ({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isLoading = ref.watch(authControllerProvider);
    return Scaffold(
      appBar: AppBar(
        title: Image.asset(
          Constants.logoPath,
          height: 50,
          ),
      ),
      body: isLoading ? const Loader() : Column(
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