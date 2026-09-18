package com.orion.mdd.users;

import org.springframework.stereotype.Service;

import com.orion.mdd.users.exceptions.UserNotFoundException;

/** Implémentation par défaut de {@link UserService}. */
@Service
class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** {@inheritDoc} */
    @Override
    public User loadUserByEmailOrUsername(String emailOrUsername) {
        return userRepository.findByEmailOrUsername(emailOrUsername)
                .orElseThrow(UserNotFoundException::new);
    }

    /** {@inheritDoc} */
    @Override
    public User loadById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);
    }

    /** {@inheritDoc} */
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /** {@inheritDoc} */
    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    /** {@inheritDoc} */
    @Override
    public boolean existsByEmailAndNotId(String email, Long id) {
        return userRepository.existsByEmailAndIdNot(email, id);
    }

    /** {@inheritDoc} */
    @Override
    public boolean existsByUsernameAndNotId(String username, Long id) {
        return userRepository.existsByUsernameAndIdNot(username, id);
    }

    /** {@inheritDoc} */
    @Override
    public User create(User user) {
        return userRepository.save(user);
    }

}
