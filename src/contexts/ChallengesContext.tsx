import { createContext, useState, ReactNode, useEffect } from 'react'
import challenges from '../../challenges.json'

interface ChallengesProviderProps {
    children: ReactNode;
}


interface Challenge {
    type: 'body' | 'eye',
    description: string,
    amount: number,
}

interface ChallengesContextData {
    level: number, 
    currentExperience: number, 
    challengesCompleted: number,
    activeChallenge: Challenge,
    experienceToNextLevel: number,
    levelUp: () => void, 
    startNewChallenge: () => void,
    resetChallenge: () => void,
    completedChallenge: () => void
}
export const challengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({ children }: ChallengesProviderProps) {
    const [level, setLevel] = useState(1)
    const [currentExperience, setCurrentExperience] = useState(0)
    const [challengesCompleted, setChallengesCompleted] = useState(0) 
    
    
    const [activeChallenge, setActiveChallenge] = useState(null)
    
    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)
	
    useEffect(() => {
        Notification.requestPermission()
    }, [])

    function levelUp() {
        setLevel(level + 1)
	}

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]
        
        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play()

        if (Notification.permission === 'granted') {
            new Notification('Novo estado', {
                body:  `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null)
    }

    function completedChallenge() {
        if(!activeChallenge) {
            return ;
        }

        const { amount } = activeChallenge

        let finalExperience = currentExperience + amount
    
        if (finalExperience >= experienceToNextLevel) {
            finalExperience -= experienceToNextLevel 
            levelUp()
        }

        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)
    }
    return (
        <challengesContext.Provider 
        value={{ level, 
            levelUp, 
            currentExperience, 
            challengesCompleted,
            startNewChallenge ,
            activeChallenge,
            resetChallenge,
            experienceToNextLevel,
            completedChallenge,
        }}
        >

            { children }
        </challengesContext.Provider>
    )
}