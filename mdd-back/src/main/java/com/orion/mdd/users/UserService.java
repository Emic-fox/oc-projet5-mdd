package com.orion.mdd.users;

public interface UserService {
    User loadUserByEmailOrUsername(String emailOrUsername);
}
