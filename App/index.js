// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert } from 'react-native';

// SnakeGame component
const BOARD_SIZE = 20;
const CELL_SIZE = 20;
const INIT_SNAKE = [{ x: 8, y: 8 }];
const INIT_FOOD = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };

const SnakeGame = () => {
    const [snake, setSnake] = useState(INIT_SNAKE);
    const [food, setFood] = useState(INIT_FOOD);
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (gameOver) {
            Alert.alert('Game Over', 'Try again!', [
                { text: 'OK', onPress: () => restartGame() },
            ]);
            return;
        }
        
        const moveSnake = () => {
            setSnake(prevSnake => {
                const newSnake = [...prevSnake];
                let head = { ...newSnake[newSnake.length - 1] };
                
                switch (direction) {
                    case 'UP':
                        head.y -= 1;
                        break;
                    case 'DOWN':
                        head.y += 1;
                        break;
                    case 'LEFT':
                        head.x -= 1;
                        break;
                    case 'RIGHT':
                        head.x += 1;
                        break;
                }

                if (head.x >= BOARD_SIZE || head.x < 0 || head.y >= BOARD_SIZE || head.y < 0) {
                    setGameOver(true);
                    return newSnake;
                }

                newSnake.push(head);

                if (head.x === food.x && head.y === food.y) {
                    setFood({ x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) });
                } else {
                    newSnake.shift();
                }

                return newSnake;
            });
        };

        intervalRef.current = setInterval(() => {
            moveSnake();
        }, 200);

        return () => clearInterval(intervalRef.current);
    }, [direction, gameOver]);

    const changeDirection = newDirection => {
        if (
            (direction === 'UP' && newDirection === 'DOWN') ||
            (direction === 'DOWN' && newDirection === 'UP') ||
            (direction === 'LEFT' && newDirection === 'RIGHT') ||
            (direction === 'RIGHT' && newDirection === 'LEFT')
        ) {
            return;
        }
        setDirection(newDirection);
    };

    const restartGame = () => {
        setSnake(INIT_SNAKE);
        setFood(INIT_FOOD);
        setDirection('RIGHT');
        setGameOver(false);
        clearInterval(intervalRef.current);
    };

    return (
        <View style={styles.container}>
            <View style={styles.board}>
                {Array.from(Array(BOARD_SIZE)).map((_, rowIdx) => (
                    <View key={rowIdx} style={styles.row}>
                        {Array.from(Array(BOARD_SIZE)).map((_, colIdx) => (
                            <View key={colIdx} style={[
                                styles.cell, 
                                snake.some(s => s.x === colIdx && s.y === rowIdx) && styles.snake,
                                food.x === colIdx && food.y === rowIdx && styles.food
                            ]} />
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => changeDirection('UP')} style={styles.controlButton}>
                    <Text>↑</Text>
                </TouchableOpacity>
                <View style={styles.horizontalControls}>
                    <TouchableOpacity onPress={() => changeDirection('LEFT')} style={styles.controlButton}>
                        <Text>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeDirection('RIGHT')} style={styles.controlButton}>
                        <Text>→</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => changeDirection('DOWN')} style={styles.controlButton}>
                    <Text>↓</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    board: {
        width: BOARD_SIZE * CELL_SIZE,
        height: BOARD_SIZE * CELL_SIZE,
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#000',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    snake: {
        backgroundColor: 'green',
    },
    food: {
        backgroundColor: 'red',
    },
    controls: {
        flexDirection: 'row',
        marginTop: 20,
    },
    controlButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#000',
        margin: 5,
    },
    horizontalControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 100,
    },
});

// App component
export default function App() {
    return (
        <SafeAreaView style={appStyles.container}>
            <SnakeGame />
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#FFF',
    },
});