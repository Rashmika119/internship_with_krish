package org.example;
import java.util.Random;
import java.util.Scanner;


public class Main {
    public static void main(String[] args) {

        Random random=new Random();
        int number=random.nextInt(26);
        char generatedLetter =(char)(number+'A');//A-Ascii value 65

        boolean isGuessCorrect=false;
        int count=0;
        Scanner scan = new Scanner(System.in);
        while(!isGuessCorrect) {

            System.out.println("Guess the character: ");
            try {
                String inputCharacter = scan.nextLine().trim();
                int arrayLength = inputCharacter.length();

                char userGuessedLetter = inputCharacter.charAt(0);
                boolean isAlphabet = Character.isLetter(userGuessedLetter);

                if (arrayLength == 1 && isAlphabet) {
                    count++;
                    char validUserGuessedLetter = inputCharacter.charAt(0);
                    char inputInUpperCase = Character.toUpperCase(validUserGuessedLetter);

                    int difference=Math.abs(inputInUpperCase-generatedLetter);

                    if (difference == 0) {
                        isGuessCorrect=true;
                        System.out.println("You guessed the character " + generatedLetter + " ,after " + count + " trial. welldone!");
                    } else if (difference <= 3) {
                        System.out.println("Hot...You are So close..Try again!");

                    } else if ((difference<=6)){
                        System.out.println("Warm...You are close..Try again!");

                    } else if ((difference<=9) ) {
                        System.out.println("Cold...You are bit away the track..Try again!");
                    } else {
                        System.out.println("Ice...You are out of there..try again");
                    }

                } else {
                    System.out.println("Invalid input.Enter a valid input character");
                }
            }catch (Exception e) {
                System.out.println("Invalid input...message: "+e.getMessage());
            }
        }
        }

    }
