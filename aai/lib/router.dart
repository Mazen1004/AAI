import 'package:aai/features/post/screens/add_post_tag_screen.dart';
import 'package:flutter/material.dart';
import 'package:aai/features/auth/screen/login_screen.dart';
import 'package:routemaster/routemaster.dart';
import 'package:aai/features/home/screens/home_screen.dart';
import 'package:aai/features/user_profile/screens/edit_profile_screen.dart';
import 'package:aai/features/user_profile/screens/user_profile_screen.dart';

final loggedOutRoute = RouteMap(routes: {
  '/': (_) => const MaterialPage(child: LoginScreen()),
});

final loggedInRoute = RouteMap(
  routes: {
    '/': (_) => const MaterialPage(child: HomeScreen()),
    '/u/:uid': (routeData) => MaterialPage(
          child: UserProfileScreen(
            uid: routeData.pathParameters['uid']!,
          ),
        ),
    '/edit-profile/:uid': (routeData) => MaterialPage(
          child: EditProfileScreen(
            uid: routeData.pathParameters['uid']!,
          ),
        ),
    '/add-post/:type': (routeData) => MaterialPage(
          child: AddPostTypeScreen(
            type: routeData.pathParameters['type']!,
          ),
        ),
  },
);