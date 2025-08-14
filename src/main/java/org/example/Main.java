package org.example;
import java.util.Random;
import java.util.Scanner;


public class Main {
    public static void main(String[] args) {
        Random random=new Random();
        int number=random.nextInt(26);//0-25
        char generatedLetter =(char)(number+'A');//A-Ascii value 65

        boolean isGuessCorrect=false;
        int count=0;

        while(isGuessCorrect==false) {
            System.out.println("Guess the character: ");
            Scanner scan = new Scanner(System.in);
            char inputCharacter = scan.next().charAt(0);
            char inputInUpperCase = Character.toUpperCase(inputCharacter);
            int inputAsciiValue=inputInUpperCase;

            if (inputInUpperCase == generatedLetter) {
                count++;
                isGuessCorrect=true;
                System.out.println("You guessed the character " + inputCharacter+" ,after "+count+" trial. welldone!");
            } else if ((inputAsciiValue<=(number+3+65)) && (inputAsciiValue>=(number-3+65))) {
                count++;
                System.out.println("Hot...You are So close..Try again!");
                
            }else if(((inputAsciiValue>=(number-6+65)&&(inputAsciiValue<=(number+6+65)))&& ((inputAsciiValue<(number-2+65)) &&(inputAsciiValue>(number+2+65))))) {
                count++;
                System.out.println("Warm...You are close..Try again!");

            } else if (((inputAsciiValue>=(number-9+65)&&(inputAsciiValue<=(number+9+65)))&&((inputAsciiValue<(number-6+65)) &&(inputAsciiValue>(number+6+65))))) {
                count++;
                System.out.println("Cold...You are bit away the track..Try again!");
            }else{
                count++;
                System.out.println("Ice...You are out of there..try again");
            }
        }

    }
}