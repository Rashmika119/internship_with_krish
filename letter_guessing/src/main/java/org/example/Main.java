package org.example;
import java.util.Random;
import java.util.Scanner;


public class Main {
    private static final int ALPHABET_SIZE=26;
    private static final char FIRST_LETTER='A';

    private static final int HOT=3;
    private static final int WARM=6;
    private static final int COLD=9;

    public static void main(String[] args) {

        Random random=new Random();
        int number=random.nextInt(ALPHABET_SIZE);
        char generatedLetter =(char)(number+FIRST_LETTER);//A-Ascii value 65

        boolean isGuessCorrect=false;
        int count=0;
        Scanner scan = new Scanner(System.in);
        while(!isGuessCorrect) {

            System.out.println("Guess the character: ");
            try {
                String inputCharacter = scan.nextLine().trim();

                if (inputCharacter.isEmpty()){
                    System.out.println("Empty input.Please enter a letter");
                    continue;
                }

                if(inputCharacter.length()>1){
                    System.out.println("Please enter exactly one character");
                    continue;
                }

                char userGuessedLetter = inputCharacter.charAt(0);
                if(!Character.isLetter(userGuessedLetter)){
                    System.out.println("Invalid input.Please enter valid alphabet character");
                    continue;
                };


                    count++;
                    char validUserGuessedLetter = inputCharacter.charAt(0);
                    char inputInUpperCase = Character.toUpperCase(validUserGuessedLetter);

                    int difference=Math.abs(inputInUpperCase-generatedLetter);

                    if (difference == 0) {
                        isGuessCorrect=true;
                        System.out.println("You guessed the character " + generatedLetter + " ,after " + count + " trial. welldone!");
                    } else if (difference <= HOT) {
                        System.out.println("Hot...You are So close..Try again!");

                    } else if ((difference<=WARM)){
                        System.out.println("Warm...You are close..Try again!");

                    } else if ((difference<=COLD) ) {
                        System.out.println("Cold...You are bit away the track..Try again!");
                    } else {
                        System.out.println("Ice...You are out of there..try again");
                    }

            }catch (Exception e) {
                System.out.println("Invalid input...message: "+e.getMessage());
            }
        }
        }

    }
