package com.orion.mdd.users;

import org.springframework.stereotype.Service;

@Service
class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User loadUserByEmailOrUsername(String emailOrUsername) {
        return userRepository.findByEmailOrUsername(emailOrUsername)
                .orElseThrow(UserNotFoundException::new);
    }

}
